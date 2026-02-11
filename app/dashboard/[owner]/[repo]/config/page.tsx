'use client';

import { useParams } from 'next/navigation';
import { Config } from '../../../components/config';

export default function Page() {
  const params = useParams<{ owner: string; repo: string }>();
  const full = `${params.owner}/${params.repo}`;

  return (
    <div className="p-10 space-y-8 min-w-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
        <p className="text-muted mt-1 capitalize">{full}</p>
      </div>
      <Config repo={params.repo} owner={params.owner} />
    </div>
  );
}
