'use client';

import { useEffect, useState } from 'react';
import type { LogEntry } from '@/app/lib/logging';
import { Stats } from './stats';

function timeago(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function Activity({ repo }: { repo: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setExpanded(null);
    fetch(`/api/dashboard/logs?repo=${encodeURIComponent(repo)}`)
      .then(r => r.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repo]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-warm rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-warm rounded-2xl h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Stats logs={logs} />

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {logs.length === 0 ? (
          <div className="border border-border rounded-2xl p-8 text-center">
            <p className="text-muted text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {logs.map(log => {
              const key = `${log.number}-${log.timestamp}`;
              const open = expanded === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setExpanded(open ? null : key)}
                  className="w-full text-left px-5 py-4 hover:bg-warm/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-xs font-medium uppercase text-accent">
                      {log.type}
                    </span>
                    <span className="text-sm font-medium w-12">
                      #{log.number}
                    </span>
                    <span className="text-sm text-fg truncate flex-1">
                      {log.title}
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      {log.labels.map(label => (
                        <span
                          key={label}
                          className="text-xs bg-warm text-muted px-2 py-0.5 rounded-full"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted shrink-0 w-8 text-right tabular-nums">
                      {timeago(log.timestamp)}
                    </span>
                  </div>
                  {open && log.reasoning && (
                    <p className="text-xs text-muted leading-relaxed mt-3 ml-24">
                      {log.reasoning}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
