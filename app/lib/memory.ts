import { redis } from './redis';

const ttl = 60 * 60 * 24 * 90;
const window = 50;

export interface Memory {
  id: string;
  repo: string;
  kind: 'issue' | 'pr';
  number: number;
  title: string;
  body: string;
  message: string;
  summary: string;
  labels: string[];
  correct: string[];
  source: 'correction' | 'learn' | 'blocklist';
  author: string;
  verified: boolean;
  timestamp: number;
}

export interface Match {
  id: string;
  title: string;
  summary: string;
  correct: string[];
  source: Memory['source'];
  verified: boolean;
  score: number;
}

function clip(text: string, size: number) {
  return text.trim().slice(0, size);
}

function tokens(text: string) {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9/]+/)
      .filter(token => token.length > 2),
  );
}

function overlap(left: Set<string>, right: Set<string>) {
  let score = 0;
  for (const token of left) {
    if (right.has(token)) score += 1;
  }
  return score;
}

function age(timestamp: number) {
  const days = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
  if (days <= 7) return 3;
  if (days <= 30) return 2;
  if (days <= 90) return 1;
  return 0;
}

function score(entry: Memory, query: string) {
  const querytokens = tokens(query);
  const entrytokens = tokens(
    [
      entry.title,
      entry.body,
      entry.message,
      entry.summary,
      entry.labels.join(' '),
      entry.correct.join(' '),
    ].join(' '),
  );
  const shared = overlap(querytokens, entrytokens);
  const verify = entry.verified ? 4 : 0;
  const recent = age(entry.timestamp);
  return shared * 2 + verify + recent;
}

export async function writememory(
  repo: string,
  entry: Omit<Memory, 'id' | 'repo' | 'timestamp'>,
) {
  const full: Memory = {
    ...entry,
    repo,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    title: clip(entry.title, 200),
    body: clip(entry.body, 1200),
    message: clip(entry.message, 800),
    summary: clip(entry.summary, 400),
  };

  await redis.zadd(`memory:${repo}`, {
    score: full.timestamp,
    member: JSON.stringify(full),
  });
  await redis.expire(`memory:${repo}`, ttl);
  return full;
}

export async function readmemory(repo: string, limit = 50): Promise<Memory[]> {
  const raw = await redis.zrange<string[]>(`memory:${repo}`, 0, limit - 1, {
    rev: true,
  });
  return raw.map(item => (typeof item === 'string' ? JSON.parse(item) : item));
}

export async function matchmemory(repo: string, query: string, limit = 3) {
  const items = await readmemory(repo, window);
  return items
    .map(item => ({ item, score: score(item, query) }))
    .filter(item => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(
      ({ item, score }) =>
        ({
          id: item.id,
          title: item.title,
          summary: item.summary || item.message,
          correct: item.correct,
          source: item.source,
          verified: item.verified,
          score,
        }) satisfies Match,
    );
}
