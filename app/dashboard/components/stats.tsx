import type { LogEntry } from '@/app/lib/logging';

function labelcount(log: LogEntry): number {
  if (!log.labels) return 0;
  return log.labels.length;
}

export function Stats({ logs }: { logs: LogEntry[] }) {
  const issues = logs.filter(l => l.type === 'issue').length;
  const prs = logs.filter(l => l.type === 'pr').length;
  const labels = logs.reduce((acc, l) => acc + labelcount(l), 0);
  const skipped = logs.filter(l => l.skipped).length;

  const items = [
    { value: logs.length, label: 'TRIAGED', desc: 'Total' },
    { value: issues, label: 'ISSUES', desc: 'Labeled' },
    { value: prs, label: 'PULL REQUESTS', desc: 'Labeled' },
    { value: labels, label: 'LABELS APPLIED', desc: 'Total' },
  ];

  if (skipped > 0) {
    items.push({ value: skipped, label: 'SKIPPED', desc: 'No labels' });
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
      {items.map(item => (
        <div key={item.label} className="bg-bg p-4 md:p-6">
          <p className="text-3xl font-semibold tracking-tight">
            {item.value || '\u2013'}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mt-1">
            {item.label}
          </p>
          <p className="text-sm text-muted mt-0.5">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}
