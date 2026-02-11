'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function Iconbar() {
  const [user, setUser] = useState({ username: '', avatar: '' });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const parts = pathname.split('/').filter(Boolean);
  const repo = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : null;
  const onconfig = pathname.endsWith('/config');

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => setUser(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="w-14 shrink-0 bg-fg rounded-2xl flex flex-col items-center py-5 gap-1">
      <a href="/" className="mb-4">
        <svg
          className="w-6 h-6 text-accent"
          viewBox="0 0 238.758 238.758"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M238.389,91.942c-1.28-3.939-5.513-6.096-9.451-4.815l-89.925,29.219l21.004-28.91c2.435-3.351,1.691-8.041-1.66-10.476c-3.352-2.435-8.041-1.691-10.476,1.66l-21.002,28.908V12.976c0-4.142-3.358-7.5-7.5-7.5c-4.142,0-7.5,3.358-7.5,7.5v94.553L90.874,78.619c-2.435-3.351-7.124-4.094-10.476-1.659c-3.351,2.434-4.094,7.124-1.66,10.475l21.004,28.91L9.82,87.127c-3.944-1.281-8.171,0.876-9.451,4.815c-1.28,3.939,0.875,8.171,4.815,9.451l89.924,29.219l-33.987,11.043c-3.939,1.28-6.095,5.511-4.815,9.451c1.03,3.169,3.97,5.184,7.131,5.184c0.768,0,1.549-0.119,2.319-0.369l33.986-11.043l-55.577,76.496c-2.435,3.351-1.691,8.041,1.66,10.476c1.331,0.967,2.874,1.433,4.402,1.433c2.319,0,4.606-1.072,6.074-3.092l55.577-76.496v35.736c0,4.142,3.358,7.5,7.5,7.5c4.142,0,7.5-3.358,7.5-7.5v-35.735l55.577,76.495c1.467,2.02,3.754,3.092,6.074,3.092c1.528,0,3.071-0.466,4.402-1.433c3.351-2.435,4.094-7.125,1.66-10.476l-55.578-76.496l33.985,11.042c0.771,0.251,1.551,0.369,2.319,0.369c3.162,0,6.101-2.015,7.131-5.184c1.28-3.939-0.876-8.171-4.815-9.451l-33.986-11.043l89.925-29.219C237.513,100.113,239.669,95.881,238.389,91.942z" />
        </svg>
      </a>

      <div className="w-8 h-px bg-white/10 mb-2" />

      <a
        href={repo ? `/dashboard/${repo}` : '/dashboard'}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
          repo && !onconfig
            ? 'bg-white/10 text-white'
            : 'text-white/40 hover:text-white hover:bg-white/5'
        }`}
        title="Dashboard"
      >
        <svg
          className="w-4 h-4"
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
      </a>
      <a
        href={repo ? `/dashboard/${repo}/config` : '/dashboard'}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
          onconfig
            ? 'bg-white/10 text-white'
            : 'text-white/40 hover:text-white hover:bg-white/5'
        }`}
        title="Configuration"
      >
        <svg
          className="w-4 h-4"
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
      </a>

      <div className="mt-auto flex flex-col items-center gap-1">
        <a
          href="/docs"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          title="Docs"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a
          href="https://github.com/tigent/app"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          title="GitHub"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        <div className="w-8 h-px bg-white/10 my-2" />

        <div className="relative" ref={ref}>
          {user.avatar ? (
            <>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="rounded-full transition-opacity hover:opacity-80"
              >
                <img
                  src={user.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full ring-2 ring-white/10"
                />
              </button>
              {open && (
                <div className="absolute -bottom-5 left-12 bg-fg text-bg rounded-2xl shadow-2xl py-3 px-1 min-w-[180px] z-50">
                  <div className="flex items-center gap-3 px-3 pb-3 border-b border-white/10">
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-white">
                      {user.username}
                    </span>
                  </div>
                  <a
                    href="/api/auth/logout"
                    className="flex items-center gap-2 mt-1 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors rounded-xl"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Logout
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          )}
        </div>
      </div>
    </nav>
  );
}
