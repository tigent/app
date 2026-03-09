import { redis } from './redis';

const keep = true;

export interface LabelDetail {
  name: string;
  reason: string;
  color: string;
}

export interface BlockedDetail {
  name: string;
  mode: 'blocklist';
  reason: string;
}

export interface MemoryDetail {
  id: string;
  title: string;
  summary: string;
  correct: string[];
  source: 'correction' | 'learn' | 'blocklist';
  verified: boolean;
  score: number;
}

export interface LogEntry {
  type: 'issue' | 'pr' | 'feedback';
  action?: 'triage' | 'explain' | 'relabel' | 'learn' | 'blocklist' | 'clarify';
  number: number;
  title: string;
  labels: LabelDetail[];
  rejected: LabelDetail[];
  blocked: BlockedDetail[];
  memories: MemoryDetail[];
  confidence?: 'high' | 'medium' | 'low';
  summary: string;
  timestamp: number;
  repo: string;
  model?: string;
  duration?: number;
  author: string;
  url: string;
  skipped?: boolean;
  available?: number;
  message?: string;
  context?: string;
}

export interface Counts {
  triage: number;
  feedback: number;
  blocked: number;
  memories: number;
}

function labels(value: unknown): LabelDetail[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => {
      if (typeof item === 'string') {
        return { name: item, reason: '', color: '' };
      }
      const row = item as Partial<LabelDetail>;
      return {
        name: row.name || '',
        reason: row.reason || '',
        color: row.color || '',
      };
    })
    .filter(item => item.name);
}

function blocked(value: unknown): BlockedDetail[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => {
      const row = item as Partial<BlockedDetail>;
      return {
        name: row.name || '',
        mode: 'blocklist' as const,
        reason: row.reason || 'blocked by repo blocklist',
      };
    })
    .filter(item => item.name);
}

function memories(value: unknown): MemoryDetail[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => {
      const row = item as Partial<MemoryDetail>;
      return {
        id: row.id || crypto.randomUUID(),
        title: row.title || '',
        summary: row.summary || '',
        correct: Array.isArray(row.correct) ? row.correct.filter(Boolean) : [],
        source: (row.source === 'learn' || row.source === 'blocklist'
          ? row.source
          : 'correction') as MemoryDetail['source'],
        verified: row.verified ?? false,
        score: typeof row.score === 'number' ? row.score : 0,
      };
    })
    .filter(item => item.title || item.summary);
}

function normalize(value: unknown): LogEntry {
  const row = (value || {}) as Partial<LogEntry>;
  return {
    type: row.type || 'issue',
    action: row.action,
    number: row.number || 0,
    title: row.title || '',
    labels: labels(row.labels),
    rejected: labels(row.rejected),
    blocked: blocked(row.blocked),
    memories: memories(row.memories),
    confidence: row.confidence,
    summary: row.summary || '',
    timestamp: row.timestamp || 0,
    repo: row.repo || '',
    model: row.model,
    duration: row.duration,
    author: row.author || '',
    url: row.url || '',
    skipped: row.skipped || false,
    available: row.available || 0,
    message: row.message,
    context: row.context,
  };
}

function count(
  log: Pick<LogEntry, 'type' | 'action' | 'blocked' | 'memories'>,
): Counts {
  return {
    triage: log.type === 'feedback' ? 0 : 1,
    feedback: log.type === 'feedback' ? 1 : 0,
    blocked: log.blocked.length,
    memories: log.memories.length,
  };
}

function total(logs: LogEntry[]): Counts {
  return logs.reduce<Counts>(
    (all, log) => {
      const next = count(log);
      return {
        triage: all.triage + next.triage,
        feedback: all.feedback + next.feedback,
        blocked: all.blocked + next.blocked,
        memories: all.memories + next.memories,
      };
    },
    {
      triage: 0,
      feedback: 0,
      blocked: 0,
      memories: 0,
    },
  );
}

function readcount(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number.parseInt(value, 10) || 0;
  return 0;
}

export async function writelog(
  repo: string,
  entry: Omit<LogEntry, 'timestamp' | 'repo'>,
) {
  const full: LogEntry = {
    ...entry,
    repo,
    timestamp: Date.now(),
  };
  const key = `logs:${repo}`;
  const stats = count(full);
  await redis.zadd(key, {
    score: full.timestamp,
    member: JSON.stringify(full),
  });
  const work = [
    redis.hincrby(`stats:${repo}`, 'triage', stats.triage),
    redis.hincrby(`stats:${repo}`, 'feedback', stats.feedback),
    redis.hincrby(`stats:${repo}`, 'blocked', stats.blocked),
    redis.hincrby(`stats:${repo}`, 'memories', stats.memories),
  ];
  if (keep) {
    work.unshift(redis.persist(key));
  }
  await Promise.all(work);
}

export async function readlogs(
  repo: string,
  offset = 0,
  limit = 100,
): Promise<LogEntry[]> {
  const end = limit < 0 ? -1 : offset + limit - 1;
  const raw = await redis.zrange<string[]>(`logs:${repo}`, offset, end, {
    rev: true,
  });
  return raw.map(item => {
    const parsed = typeof item === 'string' ? JSON.parse(item) : item;
    return normalize(parsed);
  });
}

export async function counts(repo: string): Promise<Counts> {
  const raw = await redis.hgetall<Record<string, string>>(`stats:${repo}`);
  if (raw && Object.keys(raw).length > 0) {
    return {
      triage: readcount(raw.triage),
      feedback: readcount(raw.feedback),
      blocked: readcount(raw.blocked),
      memories: readcount(raw.memories),
    };
  }

  const logs = await readlogs(repo, 0, -1);
  const all = total(logs);
  if (logs.length > 0) {
    await redis.hset(`stats:${repo}`, {
      triage: all.triage,
      feedback: all.feedback,
      blocked: all.blocked,
      memories: all.memories,
    });
  }
  return all;
}

export async function readcontext(
  repo: string,
  number: number,
  type: 'issue' | 'pr',
  limit = 250,
) {
  const logs = await readlogs(repo, 0, limit);
  const match = logs.find(
    log =>
      log.type === type &&
      log.action === 'triage' &&
      log.number === number &&
      typeof log.context === 'string' &&
      log.context.trim().length > 0,
  );
  return match?.context || '';
}
