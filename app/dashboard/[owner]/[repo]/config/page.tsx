import { redirect } from 'next/navigation';
import { Autherror } from '@/app/lib/github';
import { token } from '@/app/lib/oauth';
import { readconfig } from '@/app/lib/repos';
import { getsession } from '@/app/lib/session';
import { Config } from '../../../components/config';

export default async function Page({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const session = await getsession();
  const value = await token(session);

  try {
    const content = value ? await readconfig(value, owner, repo) : null;

    return (
      <div className="min-w-0 p-4 md:h-full md:min-h-0 md:overflow-hidden md:p-8">
        <div className="flex min-h-full w-full flex-col gap-5 md:h-full md:min-h-0">
          <section className="rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top_left,rgba(212,228,92,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] px-5 py-5 md:px-7 md:py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                    {owner} / {repo}
                  </p>
                  <h1 className="mt-2 text-[2rem] font-semibold tracking-tight md:text-[2.7rem]">
                    Inspect the live triage rules
                  </h1>
                  <p className="mt-2.5 max-w-2xl text-sm leading-6 text-muted">
                    Blocked labels, model selection, and prompt guidance live
                    here so the operator console can stay focused on recent
                    work.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <div className="md:min-h-0 md:flex-1">
            <Config content={content} />
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
