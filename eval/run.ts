import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { handlecomment, planmessage } from '../app/api/webhook/feedback';
import { createpr } from '../app/api/webhook/learn';
import type { Gh, Label } from '../app/api/webhook/triage';
import { classify } from '../app/api/webhook/triage';
import { parseconfig } from '../app/lib/config';
import { allowed } from '../app/lib/scope';
import type {
  Evalcase,
  Feedbackdata,
  Learndata,
  Row,
  Scopedata,
  Triagedata,
} from './kinds';
import { readcases, readlabels } from './load';
import { mock } from './mock';

function low(items: string[]) {
  return items.map(item => item.toLowerCase());
}

function same(left: string[], right: string[]) {
  const one = [...new Set(low(left))].sort();
  const two = [...new Set(low(right))].sort();
  return (
    one.length === two.length && one.every((item, index) => item === two[index])
  );
}

function have(items: string[], name: string) {
  return items.some(item => item.toLowerCase() === name.toLowerCase());
}

function show(items: string[]) {
  return items.length > 0 ? items.join(', ') : '(none)';
}

function detail(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function config() {
  const file = path.join(process.cwd(), '.github/tigent.yml');
  return parseconfig(await readFile(file, 'utf8'));
}

function pick(all: Label[], names?: string[]) {
  if (!names || names.length === 0) return all;
  const allow = new Set(names.map(name => name.toLowerCase()));
  return all.filter(label => allow.has(label.name.toLowerCase()));
}

async function triage(item: Triagedata, all: Label[]) {
  const started = Date.now();
  const rules = await config();
  const gh = {
    owner: item.source.owner,
    repo: item.source.repo,
    octokit: {} as Gh['octokit'],
  } satisfies Gh;
  const labels = pick(all, item.available);
  const rows: string[] = [];

  for (let index = 0; index < item.runs; index += 1) {
    const result = await classify(
      gh,
      rules,
      labels,
      item.subject.title,
      item.subject.body,
      item.subject.extra,
      { memories: [] },
    );

    const added = result.labels.map(label => label.name);
    const blocked = result.blocked.map(label => label.name);
    const missing = item.expect.added.filter(name => !have(added, name));
    const excluded = item.expect.excluded.filter(name => have(added, name));
    const hidden = item.expect.blocked.filter(name => !have(blocked, name));
    const groups = item.expect.one.filter(
      group => !group.some(name => have(added, name)),
    );

    rows.push(
      `run ${index + 1}: added=${show(added)} blocked=${show(blocked)} confidence=${result.confidence || '(none)'}`,
    );

    if (
      missing.length > 0 ||
      excluded.length > 0 ||
      hidden.length > 0 ||
      groups.length > 0
    ) {
      return {
        id: String(item.source.number),
        suite: item.suite,
        url: item.source.url,
        pass: false,
        text: [
          missing.length > 0 ? `missing: ${missing.join(', ')}` : '',
          excluded.length > 0 ? `excluded: ${excluded.join(', ')}` : '',
          hidden.length > 0 ? `blocked missing: ${hidden.join(', ')}` : '',
          groups.length > 0
            ? `one missing: ${groups.map(group => `[${group.join(', ')}]`).join(', ')}`
            : '',
          item.gold?.length ? `gold: ${item.gold.join(', ')}` : '',
          ...rows,
        ]
          .filter(Boolean)
          .join(' | '),
        time: Date.now() - started,
      } satisfies Row;
    }
  }

  return {
    id: String(item.source.number),
    suite: item.suite,
    url: item.source.url,
    pass: true,
    text: rows.join(' | '),
    time: Date.now() - started,
  } satisfies Row;
}

async function feedback(item: Feedbackdata, all: Label[]) {
  const started = Date.now();
  const rules = await config();
  const labels = pick(all, item.available);
  const rows: string[] = [];

  const result = await planmessage(
    rules,
    item.subject,
    item.message,
    labels,
    item.current,
  );

  rows.push(
    `add=${show(result.add)} remove=${show(result.remove)} block=${show(result.block)} explain=${result.explain} learn=${result.learn} clarify=${result.clarify ? 'yes' : 'no'}`,
  );

  const checks = [
    same(result.add, item.expect.add),
    same(result.remove, item.expect.remove),
    same(result.block, item.expect.block),
    result.explain === item.expect.explain,
    result.learn === item.expect.learn,
    Boolean(result.clarify) === item.expect.clarify,
  ];

  if (item.runtime) {
    const fake = mock(
      item.source.owner,
      item.source.repo,
      labels,
      item.current,
    );
    await handlecomment(
      fake.gh,
      rules,
      {
        comment: {
          id: 1,
          body: `@tigent ${item.message}`,
          author_association: 'MEMBER',
          user: { login: 'maintainer' },
        },
        issue: {
          number: item.source.number,
          title: item.subject.title,
          body: item.subject.body,
          html_url: item.source.url,
          pull_request:
            item.subject.kind === 'pr' ? { url: item.source.url } : undefined,
        },
      },
      {
        log: async () => undefined,
        memory: async () => undefined as never,
        learn: async () => {
          throw new Error('unexpected learning path in feedback runtime eval');
        },
      },
    );

    const added = fake.state.added.flat();
    const removed = fake.state.removed;
    const reaction = fake.state.reactions.at(-1) || '';
    const reply = fake.state.comments.at(-1) || '';

    rows.push(
      `runtime reaction=${reaction || '(none)'} added=${show(added)} removed=${show(removed)} reply=${reply || '(none)'}`,
    );

    checks.push(
      reaction === item.runtime.reaction,
      same(added, item.runtime.added),
      same(removed, item.runtime.removed),
      reply.includes(item.runtime.reply),
    );
  }

  const pass = checks.every(Boolean);

  return {
    id: String(item.source.number),
    suite: item.suite,
    url: item.source.url,
    pass,
    text: rows.join(' | '),
    time: Date.now() - started,
  } satisfies Row;
}

async function learn(item: Learndata, all: Label[]) {
  const started = Date.now();
  const rules = await config();
  const fake = mock(
    item.trigger.owner,
    item.trigger.repo,
    pick(all, item.available),
  );
  const result = await createpr(
    fake.gh,
    {
      kind: item.trigger.kind,
      number: item.trigger.number,
      title: item.subject.title,
      body: item.subject.body,
      message: item.message,
      correct: item.correct,
      labels: item.current,
      block: item.block,
    },
    rules,
  );

  const pass =
    result.verified === item.expect.verified &&
    fake.state.draft === item.expect.draft &&
    (item.expect.verified ? same(result.picked, item.correct) : true);

  return {
    id: String(item.source.number),
    suite: item.suite,
    url: item.source.url,
    pass,
    text: `verified=${result.verified} draft=${fake.state.draft} attempts=${result.attempts} labels=${show(result.picked)}`,
    time: Date.now() - started,
  } satisfies Row;
}

async function scope(item: Scopedata) {
  const started = Date.now();
  const rows: string[] = [];

  for (const check of item.checks) {
    const result = allowed(check.owner, check.repo);
    rows.push(`${check.owner}/${check.repo}=${result}`);
    if (result !== check.expect) {
      return {
        id: String(item.source.number),
        suite: item.suite,
        url: item.source.url,
        pass: false,
        text: rows.join(' | '),
        time: Date.now() - started,
      } satisfies Row;
    }
  }

  return {
    id: String(item.source.number),
    suite: item.suite,
    url: item.source.url,
    pass: true,
    text: rows.join(' | '),
    time: Date.now() - started,
  } satisfies Row;
}

function print(row: Row) {
  console.log(
    `${row.pass ? 'pass' : 'fail'} ${row.suite}/${row.id} ${row.time}ms`,
  );
  if (row.url) console.log(`  ${row.url}`);
  console.log(`  ${row.text}`);
}

async function run(item: Evalcase, all: Label[]) {
  if (item.suite === 'triage') return triage(item, all);
  if (item.suite === 'feedback') return feedback(item, all);
  if (item.suite === 'learn') return learn(item, all);
  return scope(item);
}

async function main() {
  const name = process.argv
    .find(item => item.startsWith('--name='))
    ?.split('=')[1];
  const labels = await readlabels();
  const all = labels.map(label => ({
    name: label.name,
    description: label.description,
    color: label.color,
  })) satisfies Label[];
  const cases = await readcases();
  const list = name
    ? cases.filter(item => String(item.source.number) === name)
    : cases;

  if (list.length === 0) {
    throw new Error(name ? `no eval numbered ${name}` : 'no evals found');
  }

  const rows: Row[] = [];
  for (const item of list) {
    try {
      rows.push(await run(item, all));
    } catch (error) {
      rows.push({
        id: String(item.source.number),
        suite: item.suite,
        url: item.source.url,
        pass: false,
        text: detail(error),
        time: 0,
      });
    }
  }

  for (const row of rows) print(row);
  const pass = rows.filter(row => row.pass).length;
  const fail = rows.length - pass;
  const time = rows.reduce((sum, row) => sum + row.time, 0);
  console.log(`summary pass=${pass} fail=${fail} time=${time}ms`);
  if (fail > 0) process.exitCode = 1;
}

await main();
