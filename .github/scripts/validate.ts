import { parse } from 'yaml';
import { z } from 'zod';
import { readFileSync, existsSync } from 'fs';

const schema = z.object({
  confidence: z.number().min(0).max(1).optional(),
  theme: z.string().optional(),
  themes: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  labels: z.record(z.string(), z.string()).optional(),
  rules: z
    .array(
      z.object({
        match: z.string(),
        add: z.array(z.string()),
      }),
    )
    .optional(),
  reactions: z
    .object({
      start: z.string().optional(),
      complete: z.string().optional(),
    })
    .optional(),
  ignore: z
    .object({
      users: z.array(z.string()).optional(),
      labels: z.array(z.string()).optional(),
    })
    .optional(),
  duplicates: z
    .object({
      enabled: z.boolean().optional(),
      threshold: z.number().min(0).max(1).optional(),
      label: z.string().optional(),
      comment: z.boolean().optional(),
      close: z.boolean().optional(),
    })
    .optional(),
  autorespond: z
    .object({
      enabled: z.boolean().optional(),
      label: z.string().optional(),
      context: z.string().optional(),
      requirements: z.record(z.string(), z.array(z.string())).optional(),
      message: z.string().optional(),
    })
    .optional(),
});

const configpath = '.github/tigent.yml';

if (!existsSync(configpath)) {
  console.log('no config file found, skipping validation');
  process.exit(0);
}

const content = readFileSync(configpath, 'utf-8');

let parsed: unknown;
try {
  parsed = parse(content);
} catch (err) {
  console.error('invalid yaml syntax');
  console.error(err);
  process.exit(1);
}

const result = schema.safeParse(parsed);

if (!result.success) {
  console.error('config validation failed:');
  for (const issue of result.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

console.log('config is valid');
