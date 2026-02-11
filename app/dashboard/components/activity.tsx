'use client';

import { useState } from 'react';
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

function ms(val: number) {
  if (!val) return '';
  if (val < 1000) return `${val}ms`;
  return `${(val / 1000).toFixed(1)}s`;
}

function modelname(model: string) {
  if (!model) return '';
  const parts = model.split('/');
  return parts[parts.length - 1] || model;
}

function islight(hex: string) {
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 150;
}

function labeldata(log: LogEntry): { name: string; color: string }[] {
  if (!log.labels) return [];
  if (typeof log.labels[0] === 'string')
    return (log.labels as unknown as string[]).map(n => ({
      name: n,
      color: '',
    }));
  return log.labels.map(l => ({ name: l.name, color: l.color || '' }));
}

export function Activity({ logs }: { logs: LogEntry[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

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
              const ld = labeldata(log);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setExpanded(open ? null : key)}
                  className="w-full text-left px-4 md:px-5 py-3 md:py-4 hover:bg-warm/50 transition-colors"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <span
                      className={`hidden md:inline w-14 text-xs font-mono font-medium uppercase ${log.skipped ? 'text-muted' : 'text-fg/50'}`}
                    >
                      {log.skipped ? 'skip' : log.type}
                    </span>
                    <span className="text-xs md:text-sm font-medium tabular-nums shrink-0">
                      #{log.number}
                    </span>
                    <span className="text-xs md:text-sm text-fg truncate flex-1">
                      {log.title}
                    </span>
                    <div className="hidden md:flex gap-1.5 shrink-0">
                      {ld.map(l =>
                        l.color ? (
                          <span
                            key={l.name}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `#${l.color}`,
                              color: islight(l.color) ? '#000' : '#fff',
                            }}
                          >
                            {l.name}
                          </span>
                        ) : (
                          <span
                            key={l.name}
                            className="text-xs bg-warm text-muted px-2 py-0.5 rounded-full"
                          >
                            {l.name}
                          </span>
                        ),
                      )}
                    </div>
                    <span className="text-xs text-muted shrink-0 w-8 text-right tabular-nums">
                      {timeago(log.timestamp)}
                    </span>
                  </div>

                  {ld.length > 0 && (
                    <div className="flex md:hidden gap-1.5 flex-wrap mt-2 ml-0">
                      {ld.map(l =>
                        l.color ? (
                          <span
                            key={l.name}
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `#${l.color}`,
                              color: islight(l.color) ? '#000' : '#fff',
                            }}
                          >
                            {l.name}
                          </span>
                        ) : (
                          <span
                            key={l.name}
                            className="text-[10px] bg-warm text-muted px-1.5 py-0.5 rounded-full"
                          >
                            {l.name}
                          </span>
                        ),
                      )}
                    </div>
                  )}

                  {open && (
                    <div className="mt-4 md:ml-[4.25rem] space-y-4">
                      {log.summary && (
                        <p className="text-sm text-fg/80">{log.summary}</p>
                      )}

                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
                        {log.author && (
                          <span>
                            by{' '}
                            <span className="text-fg font-medium">
                              {log.author}
                            </span>
                          </span>
                        )}
                        {log.confidence && (
                          <span
                            className={
                              log.confidence === 'high'
                                ? 'text-fg/60'
                                : log.confidence === 'medium'
                                  ? 'text-muted'
                                  : 'text-muted/60'
                            }
                          >
                            {log.confidence} confidence
                          </span>
                        )}
                        {log.model && <span>{modelname(log.model)}</span>}
                        {log.duration > 0 && <span>{ms(log.duration)}</span>}
                        {log.available > 0 && (
                          <span>
                            {ld.length} of {log.available} labels
                          </span>
                        )}
                        {log.url && (
                          <a
                            href={log.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-fg/60 hover:text-fg transition-colors underline underline-offset-2"
                          >
                            view on github
                          </a>
                        )}
                      </div>

                      {log.labels?.length > 0 &&
                        typeof log.labels[0] !== 'string' && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-fg/60 uppercase tracking-wide">
                              Applied
                            </p>
                            {log.labels.map(l => (
                              <div key={l.name} className="flex gap-2 text-xs">
                                <span className="text-fg font-medium shrink-0">
                                  {l.name}
                                </span>
                                <span className="text-muted">{l.reason}</span>
                              </div>
                            ))}
                          </div>
                        )}

                      {log.rejected?.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium text-fg/60 uppercase tracking-wide">
                            Considered
                          </p>
                          {log.rejected.map(l => (
                            <div key={l.name} className="flex gap-2 text-xs">
                              <span className="text-muted/80 shrink-0">
                                {l.name}
                              </span>
                              <span className="text-muted/60">{l.reason}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {'reasoning' in log &&
                        typeof log.reasoning === 'string' && (
                          <p className="text-xs text-muted leading-relaxed">
                            {log.reasoning}
                          </p>
                        )}
                    </div>
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
