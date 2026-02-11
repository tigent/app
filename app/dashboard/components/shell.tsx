'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Repo } from '@/app/api/dashboard/installations/route';
import { Iconbar } from './header';
import { Sidebar } from './sidebar';

export function Shell({ children }: { children: React.ReactNode }) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/dashboard/installations')
      .then(r => r.json())
      .then((data: Repo[]) => {
        setRepos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const parts = pathname.split('/').filter(Boolean);
  const selected = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : null;

  return (
    <>
      <Iconbar />
      <Sidebar repos={repos} selected={selected} loading={loading} />
      <main className="flex-1 min-w-0 bg-bg rounded-2xl overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </main>
    </>
  );
}
