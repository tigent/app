import { parse } from 'yaml';
import { z } from 'zod';
import { readFileSync, existsSync } from 'fs';

const schema = z.object({
  confidence: z.number().min(0).max(1).optional(),
  model: z.string().optional(),
  prompt: z.string().optional(),
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
