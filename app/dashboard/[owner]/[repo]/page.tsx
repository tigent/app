'use client';

import { useParams } from 'next/navigation';
import { Activity } from '../../components/activity';

export default function Page() {
  const params = useParams<{ owner: string; repo: string }>();
  const full = `${params.owner}/${params.repo}`;

  return (
    <div className="p-5 md:p-10 space-y-6 md:space-y-8 min-w-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted mt-1 capitalize">{full}</p>
      </div>
      <Activity repo={full} />
    </div>
  );
}
