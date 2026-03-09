import { parseconfig } from '@/app/lib/config';
import { label } from '@/app/lib/model';

function indent(line: string) {
  const trimmed = line.replace(/^ +/, '');
  const spaces = line.length - trimmed.length;
  return { text: trimmed, pad: spaces * 0.6 };
}

export function Config({ content }: { content: string | null }) {
  const config = parseconfig(content || '');
  const lines = content ? content.split('\n') : [];
  const prompt = config.prompt.split('\n').filter(Boolean);
  const cards = [
    {
      label: 'Model',
      value: label(config.model),
      detail: 'Classification runtime',
    },
    {
      label: 'Blocklist',
      value:
        config.blocklist.length === 0
          ? 'None'
          : `${config.blocklist.length} labels`,
      detail: 'Hard enforcement in code',
    },
    {
      label: 'Prompt',
      value: prompt.length === 0 ? 'Defaults' : `${prompt.length} lines`,
      detail: 'Repo guidance',
    },
  ];

  return (
    <div className="grid gap-5 md:h-full md:min-h-0 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div className="flex min-h-0 flex-col gap-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {cards.map(item => (
            <div
              key={item.label}
              className="rounded-[1.75rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] px-5 py-5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                {item.label}
              </p>
              <p className="mt-3 break-words text-lg font-semibold tracking-tight text-fg/90">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-muted">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-5 md:min-h-0 xl:grid-cols-2">
          <section className="flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold">Blocklist</h2>
              <p className="mt-1 text-sm text-muted">
                These labels are never applied by Tigent
              </p>
            </div>
            <div className="min-h-[14rem] flex-1 overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:min-h-0">
              {config.blocklist.length === 0 ? (
                <div className="rounded-[1.25rem] border border-dashed border-border bg-bg/50 px-4 py-5 text-sm text-muted">
                  No blocked labels configured
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {config.blocklist.map(item => (
                    <span
                      key={item}
                      className="rounded-full bg-fg px-3 py-1.5 text-xs font-medium text-bg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
          <section className="flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold">Prompt Preview</h2>
              <p className="mt-1 text-sm text-muted">
                Keep blocklist rules out of the prompt and focus it on
                classification guidance
              </p>
            </div>
            <div className="min-h-[14rem] flex-1 overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:min-h-0">
              {prompt.length === 0 ? (
                <div className="rounded-[1.25rem] border border-dashed border-border bg-bg/50 px-4 py-5 text-sm text-muted">
                  Using default prompt behavior
                </div>
              ) : (
                <div className="rounded-[1.25rem] border border-border bg-bg/70 px-4 py-4">
                  <div className="space-y-2">
                    {prompt.map((line, index) => (
                      <p
                        key={`${index}:${line}`}
                        className="text-sm leading-6 text-fg/80"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <section className="flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">Raw tigent.yml</h2>
          <p className="mt-1 text-sm text-muted">
            The exact config file currently loaded from the repository
          </p>
        </div>
        {lines.length > 0 ? (
          <div className="min-h-[18rem] flex-1 overflow-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:min-h-0">
            <div className="min-w-[30rem] rounded-[1.25rem] border border-border bg-warm/70 px-4 py-4">
              {lines.map((line, index) => {
                const key = `${index}:${line}`;
                if (line.trim() === '')
                  return <div key={key} className="h-4" />;
                const { text, pad } = indent(line);
                return (
                  <p
                    key={key}
                    className="font-mono text-sm leading-relaxed text-fg/80"
                    style={{ paddingLeft: `${pad}em` }}
                  >
                    {text}
                  </p>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="px-5 py-5">
            <div className="rounded-[1.25rem] border border-dashed border-border bg-bg/50 px-4 py-6 text-center">
              <p className="text-sm text-muted">Using defaults</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
