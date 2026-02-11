import Link from 'next/link';
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
  const grouped: Record<string, Repo[]> = {};
  for (const r of repos) {
    if (!grouped[r.owner]) grouped[r.owner] = [];
    grouped[r.owner]!.push(r);
  }

  return (
    <div className="w-56 shrink-0 bg-bg rounded-2xl overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="p-5 space-y-6">
        {repos.length === 0 ? (
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted">No repos</p>
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
