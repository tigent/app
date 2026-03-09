'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navigation } from './config';

export function Menu() {
  const pathname = usePathname();
  const [open, setopen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setopen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/20 hover:text-white md:hidden"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2.5 4h11M2.5 8h11M2.5 12h11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open ? (
        <>
          <button
            type="button"
            onClick={() => setopen(false)}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm md:hidden"
            aria-label="close docs menu"
          />
          <div className="fixed inset-x-3 bottom-3 z-[60] rounded-[2rem] border border-white/10 bg-fg p-5 shadow-2xl md:hidden">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  docs menu
                </p>
                <p className="mt-1 text-sm text-white/60">
                  navigate the docs and related links
                </p>
              </div>
              <button
                type="button"
                onClick={() => setopen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4l8 8M12 4 4 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-5 space-y-5">
              {navigation.map(group => (
                <div key={group.title}>
                  <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    {group.title}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {group.items.map(item => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setopen(false)}
                          className={`block rounded-[1.1rem] px-4 py-3 text-sm transition-colors ${
                            active
                              ? 'bg-accent text-fg font-medium'
                              : 'bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-2 border-t border-white/10 pt-4">
              <a
                href="https://github.com/tigent/app"
                className="rounded-[1.1rem] border border-white/10 px-4 py-3 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
              >
                github
              </a>
              <a
                href="https://github.com/apps/tigent"
                className="rounded-[1.1rem] bg-white px-4 py-3 text-sm font-medium text-fg"
              >
                install
              </a>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
