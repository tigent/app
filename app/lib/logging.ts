import { redis } from './redis';

const TTL = 60 * 60 * 24 * 30;

export interface LabelDetail {
  name: string;
  reason: string;
  color: string;
}

export interface LogEntry {
  type: 'issue' | 'pr';
  number: number;
  title: string;
  labels: LabelDetail[];
  rejected: LabelDetail[];
  confidence: 'high' | 'medium' | 'low';
  summary: string;
  timestamp: number;
  repo: string;
  model: string;
  duration: number;
  author: string;
  url: string;
  skipped: boolean;
  available: number;
}

export async function writelog(
  repo: string,
  entry: Omit<LogEntry, 'timestamp' | 'repo'>,
) {
  const key = `logs:${repo}`;
  const full: LogEntry = {
    ...entry,
    repo,
    timestamp: Date.now(),
  };
  await redis.zadd(key, {
    score: full.timestamp,
    member: JSON.stringify(full),
  });
  await redis.expire(key, TTL);
}

export async function readlogs(
  repo: string,
  offset = 0,
  limit = 50,
): Promise<LogEntry[]> {
  const end = offset + limit - 1;
  const raw = await redis.zrange<string[]>(`logs:${repo}`, offset, end, {
    rev: true,
  });
  return raw.map(r => (typeof r === 'string' ? JSON.parse(r) : r));
}
