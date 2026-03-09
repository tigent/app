'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Repo } from '@/app/lib/github';

export function Sidebar({
  repos,
  selected,
  navigate,
}: {
  repos: Repo[];
  selected: string | null;
  navigate: () => void;
}) {
  const pathname = usePathname();
  const grouped: Record<string, Repo[]> = {};
  for (const r of repos) {
    if (!grouped[r.owner]) grouped[r.owner] = [];
    grouped[r.owner]!.push(r);
  }

  return (
    <div className="w-56 shrink-0 overflow-y-auto rounded-2xl bg-bg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="p-5 space-y-6">
        {selected ? (
          <div className="space-y-2">
            <p className="px-1 text-xs capitalize text-muted">Workspace</p>
            <div className="grid grid-cols-2 gap-1 rounded-[1.15rem] border border-border bg-warm/40 p-1">
              <Link
                href={`/dashboard/${selected}`}
                onClick={
                  pathname === `/dashboard/${selected}` ? undefined : navigate
                }
                aria-label="console"
                title="console"
                className={`flex h-10 items-center justify-center rounded-[0.95rem] transition-colors ${
                  pathname === `/dashboard/${selected}`
                    ? 'bg-fg text-bg'
                    : 'bg-bg/55 text-fg/65 hover:bg-bg/80'
                }`}
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href={`/dashboard/${selected}/config`}
                onClick={
                  pathname === `/dashboard/${selected}/config`
                    ? undefined
                    : navigate
                }
                aria-label="config"
                title="config"
                className={`flex h-10 items-center justify-center rounded-[0.95rem] transition-colors ${
                  pathname === `/dashboard/${selected}/config`
                    ? 'bg-fg text-bg'
                    : 'bg-bg/55 text-fg/65 hover:bg-bg/80'
                }`}
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ) : null}
        {repos.length === 0 ? (
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted">No Repos</p>
            <a
              href="https://github.com/apps/tigent"
              className="inline-block text-sm font-medium text-fg hover:opacity-70 transition-opacity"
            >
              + Install Tigent
            </a>
          </div>
        ) : (
          Object.entries(grouped).map(([owner, ownerrepos]) => (
            <div key={owner}>
              <p className="text-xs text-muted mb-2 px-1 capitalize">{owner}</p>
              <div className="border-t border-border pt-2">
                <ul className="space-y-0.5">
                  {ownerrepos.map(r => {
                    const full = `${r.owner}/${r.name}`;
                    const active = selected === full;
                    return (
                      <li key={r.id}>
                        <Link
                          href={`/dashboard/${r.owner}/${r.name}`}
                          onClick={active ? undefined : navigate}
                          className={`block px-3 py-2.5 text-sm rounded-xl transition-colors ${
                            active
                              ? 'bg-warm font-medium text-fg'
                              : 'text-fg/70 hover:bg-warm/50'
                          }`}
                        >
                          <span className="capitalize">{r.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
