import type { Counts } from '@/app/lib/logging';

export function Stats({ counts }: { counts: Counts }) {
  const items = [
    { value: counts.triage, label: 'triaged', desc: 'Issue and PR events' },
    { value: counts.feedback, label: 'feedback', desc: 'Maintainer actions' },
    {
      value: counts.blocked,
      label: 'blocked',
      desc: 'Labels stopped by blocklist',
    },
    { value: counts.memories, label: 'memory', desc: 'Precedents referenced' },
  ];

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4">
      {items.map(item => (
        <div
          key={item.label}
          className="min-w-[8rem] shrink-0 rounded-[1.45rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] px-3.5 py-3 md:min-w-0 md:rounded-[1.6rem] md:px-5 md:py-5"
        >
          <p className="text-[1.75rem] font-semibold leading-none tracking-tight md:text-[2rem]">
            {item.value}
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
            {item.label}
          </p>
          <p className="mt-1 hidden text-sm text-muted md:block">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}
