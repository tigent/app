import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import type { Evalcase, Labelrow } from './kinds';

const sourceschema = z.object({
  owner: z.string(),
  repo: z.string(),
  number: z.number().int().positive(),
  kind: z.enum(['issue', 'pr']),
  url: z.string().url(),
});

const subjectschema = z.object({
  title: z.string(),
  body: z.string(),
  extra: z.string().optional(),
});

const triageschema = z.object({
  suite: z.literal('triage'),
  source: sourceschema,
  subject: subjectschema,
  runs: z.number().int().positive(),
  gold: z.array(z.string()).optional(),
  available: z.array(z.string()).optional(),
  expect: z.object({
    added: z.array(z.string()),
    excluded: z.array(z.string()),
    blocked: z.array(z.string()),
    one: z.array(z.array(z.string())),
  }),
});

const feedbackschema = z.object({
  suite: z.literal('feedback'),
  source: sourceschema,
  subject: z.object({
    kind: z.enum(['issue', 'pr']),
    title: z.string(),
    body: z.string(),
  }),
  current: z.array(z.string()),
  available: z.array(z.string()).optional(),
  message: z.string(),
  expect: z.object({
    add: z.array(z.string()),
    remove: z.array(z.string()),
    block: z.array(z.string()),
    explain: z.boolean(),
    learn: z.boolean(),
    clarify: z.boolean(),
  }),
  runtime: z
    .object({
      reaction: z.string(),
      reply: z.string(),
      added: z.array(z.string()),
      removed: z.array(z.string()),
    })
    .optional(),
});

const learnschema = z.object({
  suite: z.literal('learn'),
  source: sourceschema,
  trigger: sourceschema,
  subject: subjectschema,
  current: z.array(z.string()),
  correct: z.array(z.string()),
  block: z.array(z.string()),
  available: z.array(z.string()).optional(),
  message: z.string(),
  expect: z.object({
    verified: z.boolean(),
    draft: z.boolean(),
  }),
});

const scopeschema = z.object({
  suite: z.literal('scope'),
  source: sourceschema,
  checks: z.array(
    z.object({
      owner: z.string(),
      repo: z.string(),
      expect: z.boolean(),
    }),
  ),
});

const caseschema = z.union([
  triageschema,
  feedbackschema,
  learnschema,
  scopeschema,
]);

const labelschema = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
});

export async function readlabels() {
  const file = path.join(process.cwd(), 'eval/labels.json');
  const text = await readFile(file, 'utf8');
  return z.array(labelschema).parse(JSON.parse(text)) as Labelrow[];
}

async function list(folder: string): Promise<string[]> {
  const rows = await readdir(folder, { withFileTypes: true });
  const files = await Promise.all(
    rows.map(async row => {
      const item = path.join(folder, row.name);
      if (row.isDirectory()) return list(item);
      if (row.isFile() && row.name.endsWith('.json')) return [item];
      return [];
    }),
  );
  return files.flat();
}

export async function readcases() {
  const folder = path.join(process.cwd(), 'eval/cases');
  const files = (await list(folder)).sort((left, right) => {
    const one = Number.parseInt(path.basename(left), 10);
    const two = Number.parseInt(path.basename(right), 10);
    return one - two;
  });
  const items: Evalcase[] = [];

  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const item = caseschema.parse(JSON.parse(text)) as Evalcase;
    const name = path.basename(file);
    const id = name.replace(/\.json$/, '');
    if (String(item.source.number) !== id) {
      throw new Error(
        `case file ${name} does not match source number ${item.source.number}`,
      );
    }
    items.push(item);
  }

  return items;
}
