'use client';

import { usePathname } from 'next/navigation';
import type { Repo } from '@/app/lib/github';
import { Iconbar } from './header';
import { Sidebar } from './sidebar';
import { Mobilenav } from './mobilenav';

interface User {
  username: string;
  avatar: string;
}

export function Shell({
  children,
  repos,
  user,
}: {
  children: React.ReactNode;
  repos: Repo[];
  user: User;
}) {
  const pathname = usePathname();

  const parts = pathname.split('/').filter(Boolean);
  const selected = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : null;
  return (
    <>
      <div className="hidden md:contents">
        <Iconbar user={user} />
        <Sidebar repos={repos} selected={selected} />
      </div>
      <div className="md:hidden flex flex-col flex-1 min-w-0">
        <main className="flex-1 min-w-0 bg-bg rounded-2xl overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-16">
          {children}
        </main>
        <Mobilenav repos={repos} selected={selected} />
      </div>
      <main className="hidden md:flex flex-1 min-w-0 bg-bg rounded-2xl overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </main>
    </>
  );
}
