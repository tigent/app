import { readlogs } from '@/app/lib/logging';
import { Activity } from '../../components/activity';

export default async function Page({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const full = `${owner}/${repo}`;
  const logs = await readlogs(full);

  return (
    <div className="p-5 md:p-10 space-y-6 md:space-y-8 min-w-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted mt-1 capitalize">{full}</p>
      </div>
      <Activity logs={logs} />
    </div>
  );
}
