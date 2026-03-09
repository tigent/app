export interface Blocked {
  name: string;
  mode: 'blocklist';
  reason: string;
}

function has(items: string[], name: string) {
  return items.some(item => item.toLowerCase() === name.toLowerCase());
}

export function filterlabels(blocklist: string[], labels: string[]) {
  const allowed: string[] = [];
  const blocked: Blocked[] = [];

  for (const name of labels) {
    if (has(blocklist, name)) {
      blocked.push({
        name,
        mode: 'blocklist',
        reason: 'blocked by repo blocklist',
      });
      continue;
    }
    allowed.push(name);
  }

  return { allowed, blocked };
}
