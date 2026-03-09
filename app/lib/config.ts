import { parse } from 'yaml';
import { z } from 'zod';
import { primary } from './model';

const rootschema = z.object({
  model: z.string().optional(),
  prompt: z.string().optional(),
  blocklist: z.array(z.string()).optional(),
});

export interface Config {
  model: string;
  prompt: string;
  blocklist: string[];
}

export const defaultconfig: Config = {
  model: primary,
  prompt: '',
  blocklist: [],
};

function unique(items: string[]) {
  return [...new Set(items.map(item => item.trim()).filter(Boolean))];
}

export function renderconfig(config: Config) {
  const lines: string[] = [];
  if (config.model && config.model !== defaultconfig.model) {
    lines.push(`model: ${config.model}`);
  }
  if (config.blocklist.length > 0) {
    lines.push('blocklist:');
    for (const item of config.blocklist) {
      lines.push(`  - ${item}`);
    }
  }
  if (config.prompt) {
    if (lines.length > 0) lines.push('');
    lines.push('prompt: |');
    for (const line of config.prompt.split('\n')) {
      lines.push(line ? `  ${line}` : '');
    }
  }
  return lines.join('\n');
}

export function parseconfig(text?: string | null): Config {
  if (!text) return defaultconfig;

  try {
    const raw = parse(text);
    const parsed = rootschema.safeParse(raw);
    if (!parsed.success) return defaultconfig;

    return {
      model: parsed.data.model || defaultconfig.model,
      prompt: parsed.data.prompt || '',
      blocklist: unique(parsed.data.blocklist ?? []),
    };
  } catch {
    return defaultconfig;
  }
}
