import Link from 'next/link';
import { redirect } from 'next/navigation';
import { parseconfig } from '@/app/lib/config';
import { counts, readlogs } from '@/app/lib/logging';
import { readmemory } from '@/app/lib/memory';
import { label } from '@/app/lib/model';
import { token } from '@/app/lib/oauth';
import { readconfig } from '@/app/lib/repos';
import { getsession } from '@/app/lib/session';
import { Autherror } from '@/app/lib/github';
import { Activity } from '../../components/activity';
import { Memory } from '../../components/memory';

export default async function Page({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const full = `${owner}/${repo}`;
  const session = await getsession();
  const value = await token(session);

  try {
    const [logs, stats, items, content] = await Promise.all([
      readlogs(full),
      counts(full),
      readmemory(full),
      value ? readconfig(value, owner, repo) : null,
    ]);
    const rules = parseconfig(content || '');

    return (
      <div className="min-w-0 overflow-hidden p-3 pb-24 md:h-full md:min-h-0 md:p-8">
        <div className="grid gap-4 md:h-full md:min-h-0 md:grid-rows-[auto_1fr] md:gap-5">
          <section className="rounded-[1.85rem] border border-border bg-[radial-gradient(circle_at_top_left,rgba(212,228,92,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] px-4 py-4 md:rounded-[2rem] md:px-7 md:py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                    {owner} / {repo}
                  </p>
                  <h1 className="mt-2 text-[2rem] font-semibold leading-[0.95] tracking-tight md:text-[2.7rem] md:leading-none">
                    Review triage without losing the thread
                  </h1>
                  <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-6 text-muted md:hidden">
                    Keep the thread visible, keep memory close, and move config
                    off the console.
                  </p>
                  <p className="mt-2.5 hidden max-w-2xl text-sm leading-6 text-muted md:block">
                    Recent activity stays scrollable, memory stays visible, and
                    configuration lives on its own page so the console stays
                    focused on operational work.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                  <div className="rounded-2xl border border-border bg-bg/80 px-3 py-3 md:px-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                      model
                    </p>
                    <p className="mt-1 text-sm font-medium text-fg/85">
                      {label(rules.model)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-bg/80 px-3 py-3 md:px-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                      blocklist
                    </p>
                    <p className="mt-1 text-sm font-medium text-fg/85">
                      {rules.blocklist.length} labels
                    </p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/${owner}/${repo}/config`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-fg px-4 text-sm font-medium text-bg transition-opacity hover:opacity-85 md:h-11"
                >
                  view config
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
          <div className="grid gap-4 md:min-h-0 md:gap-5 xl:grid-cols-[minmax(0,1.55fr)_23rem]">
            <div className="min-h-0 min-w-0">
              <Activity logs={logs} counts={stats} />
            </div>
            <div className="min-h-0 min-w-0">
              <Memory items={items} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (!(error instanceof Autherror)) throw error;
    session.destroy();
    redirect('/login');
  }
}
