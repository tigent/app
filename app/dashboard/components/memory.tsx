import type { Memory as Entry } from '@/app/lib/memory';

function when(timestamp: number) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(timestamp);
}

function tone(source: Entry['source']) {
  if (source === 'blocklist') return 'bg-fg text-bg';
  if (source === 'learn') return 'bg-accent text-fg';
  return 'bg-warm text-fg';
}

export function Memory({ items }: { items: Entry[] }) {
  const list = items.slice(0, 4);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.85rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] md:rounded-[2rem]">
      <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3.5 md:items-end md:px-5 md:py-4">
        <div>
          <h3 className="text-lg font-semibold">Memory</h3>
          <p className="mt-1 text-sm text-muted">
            Trusted corrections and learned precedent
          </p>
        </div>
        <span className="rounded-full border border-border bg-bg/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          {items.length} stored
        </span>
      </div>
      {items.length === 0 ? (
        <div className="grid min-h-[10.5rem] flex-1 place-items-center px-6 py-8 text-center md:min-h-0 md:py-10">
          <div>
            <p className="text-sm font-medium text-fg/75">No memory yet</p>
            <p className="mt-2 text-sm text-muted">
              Trusted maintainer corrections will start to appear here
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {list.map(item => (
            <div key={item.id} className="space-y-3 p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-fg truncate">
                    #{item.number} {item.title}
                  </p>
                  <p className="text-sm text-muted mt-1 line-clamp-2">
                    {item.summary || item.message}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wide ${tone(item.source)}`}
                  >
                    {item.source}
                  </span>
                  <span className="text-xs text-muted">
                    {when(item.timestamp)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.correct.map(label => (
                  <span
                    key={label}
                    className="rounded-full bg-warm px-2 py-1 text-xs text-fg/80"
                  >
                    {label}
                  </span>
                ))}
                {item.correct.length === 0 && (
                  <span className="text-xs text-muted">
                    No target labels stored
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
