'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Repo } from '@/app/lib/github';
import { Iconbar } from './header';
import { Mobilenav } from './mobilenav';
import { Sidebar } from './sidebar';

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
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (pathname) setPending(false);
  }, [pathname]);

  const navigate = () => setPending(true);

  const parts = pathname.split('/').filter(Boolean);
  const selected = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : null;

  return (
    <>
      <div className="hidden md:contents">
        <Iconbar user={user} navigate={navigate} />
        <Sidebar repos={repos} selected={selected} navigate={navigate} />
      </div>
      <div className="md:hidden flex flex-col flex-1 min-w-0">
        <main
          className={`flex-1 min-w-0 overflow-y-auto overflow-x-hidden rounded-2xl bg-bg pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-opacity duration-150 ${pending ? 'opacity-40 pointer-events-none' : ''}`}
        >
          {children}
        </main>
        <Mobilenav repos={repos} selected={selected} navigate={navigate} />
      </div>
      <main
        className={`hidden md:flex md:flex-col flex-1 min-w-0 bg-bg rounded-2xl overflow-hidden transition-opacity duration-150 ${pending ? 'opacity-40 pointer-events-none' : ''}`}
      >
        {children}
      </main>
    </>
  );
}
