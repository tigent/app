'use client';

import { useState } from 'react';
import type { Counts, LogEntry } from '@/app/lib/logging';
import { label } from '@/app/lib/model';
import { Stats } from './stats';

function timeago(timestamp: number) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function ms(value?: number) {
  if (!value) return '';
  if (value < 1000) return `${value}ms`;
  return `${(value / 1000).toFixed(1)}s`;
}

function modelname(model?: string) {
  if (!model) return '';
  return label(model);
}

function islight(hex: string) {
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return red * 0.299 + green * 0.587 + blue * 0.114 > 150;
}

function badge(name: string, color?: string) {
  if (!color) {
    return (
      <span
        key={name}
        className="text-xs bg-warm text-muted px-2 py-0.5 rounded-full"
      >
        {name}
      </span>
    );
  }
  return (
    <span
      key={name}
      className="text-xs px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: `#${color}`,
        color: islight(color) ? '#000' : '#fff',
      }}
    >
      {name}
    </span>
  );
}

function tone(log: LogEntry) {
  if (log.type === 'feedback') return 'feedback';
  if (log.blocked.length > 0 && log.labels.length === 0) return 'blocked';
  if (log.skipped) return 'skip';
  return log.type;
}

export function Activity({
  logs,
  counts,
}: {
  logs: LogEntry[];
  counts: Counts;
}) {
  const [open, setopen] = useState<string | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 md:gap-5">
      <section className="order-1 flex min-h-[15rem] flex-1 flex-col overflow-hidden rounded-[1.85rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] md:order-2 md:min-h-0 md:rounded-[2rem]">
        <div className="flex items-end justify-between gap-4 border-b border-border px-4 py-3.5 md:px-6 md:py-4">
          <div>
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <p className="mt-1 hidden text-sm text-muted md:block">
              the console stays fixed while this feed scrolls
            </p>
          </div>
          <div className="rounded-full border border-border bg-bg/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
            {logs.length} recent rows
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {logs.length === 0 ? (
            <div className="grid h-full place-items-center px-6 py-6 text-center md:px-8 md:py-12">
              <p className="text-muted text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {logs.map(log => {
                const key = `${log.number}-${log.timestamp}-${log.action || log.type}`;
                const expanded = open === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setopen(expanded ? null : key)}
                    className="w-full text-left px-4 py-3 transition-colors hover:bg-warm/50 md:px-5 md:py-4"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="hidden w-18 text-xs font-mono font-medium uppercase text-fg/50 md:inline">
                        {tone(log)}
                      </span>
                      <span className="text-xs md:text-sm font-medium tabular-nums shrink-0">
                        #{log.number}
                      </span>
                      <span className="text-xs md:text-sm text-fg truncate flex-1">
                        {log.title}
                      </span>
                      <div className="hidden md:flex gap-1.5 shrink-0 flex-wrap justify-end max-w-[40%]">
                        {log.labels
                          .slice(0, 3)
                          .map(label => badge(label.name, label.color))}
                        {log.blocked.slice(0, 2).map(label => (
                          <span
                            key={label.name}
                            className="rounded-full bg-fg px-2 py-0.5 text-xs text-bg"
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted shrink-0 w-8 text-right tabular-nums">
                        {timeago(log.timestamp)}
                      </span>
                    </div>

                    {(log.labels.length > 0 || log.blocked.length > 0) && (
                      <div className="flex md:hidden gap-1.5 flex-wrap mt-2">
                        {log.labels.map(label =>
                          badge(label.name, label.color),
                        )}
                        {log.blocked.map(label => (
                          <span
                            key={label.name}
                            className="rounded-full bg-fg px-1.5 py-0.5 text-[10px] text-bg"
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {expanded && (
                      <div className="mt-4 md:ml-[5.25rem] space-y-4">
                        {log.summary && (
                          <p className="text-sm text-fg/80 whitespace-pre-wrap">
                            {log.summary}
                          </p>
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
                          {log.action && <span>{log.action}</span>}
                          {log.confidence && (
                            <span>{log.confidence} confidence</span>
                          )}
                          {log.model && <span>{modelname(log.model)}</span>}
                          {log.duration ? (
                            <span>{ms(log.duration)}</span>
                          ) : null}
                          {log.available ? (
                            <span>
                              {log.labels.length} of {log.available} labels
                            </span>
                          ) : null}
                          {log.url && (
                            <a
                              href={log.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={event => event.stopPropagation()}
                              className="text-fg/60 hover:text-fg transition-colors underline underline-offset-2"
                            >
                              View on GitHub
                            </a>
                          )}
                        </div>

                        {log.message ? (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-fg/60 uppercase tracking-wide">
                              Message
                            </p>
                            <p className="text-xs text-muted">{log.message}</p>
                          </div>
                        ) : null}

                        {log.labels.length > 0 ? (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-fg/60 uppercase tracking-wide">
                              Applied
                            </p>
                            {log.labels.map(label => (
                              <div
                                key={label.name}
                                className="flex gap-2 text-xs"
                              >
                                <span className="text-fg font-medium shrink-0">
                                  {label.name}
                                </span>
                                <span className="text-muted">
                                  {label.reason}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {log.blocked.length > 0 ? (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-fg/60 uppercase tracking-wide">
                              Blocked
                            </p>
                            {log.blocked.map(label => (
                              <div
                                key={label.name}
                                className="flex gap-2 text-xs"
                              >
                                <span className="text-fg font-medium shrink-0">
                                  {label.name}
                                </span>
                                <span className="text-muted">
                                  {label.reason}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {log.rejected.length > 0 ? (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-fg/60 uppercase tracking-wide">
                              Considered
                            </p>
                            {log.rejected.map(label => (
                              <div
                                key={label.name}
                                className="flex gap-2 text-xs"
                              >
                                <span className="text-muted/80 shrink-0">
                                  {label.name}
                                </span>
                                <span className="text-muted/60">
                                  {label.reason}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {log.memories.length > 0 ? (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-fg/60 uppercase tracking-wide">
                              Memory
                            </p>
                            {log.memories.map(memory => (
                              <div
                                key={memory.id}
                                className="flex gap-2 text-xs"
                              >
                                <span className="text-fg font-medium shrink-0">
                                  {memory.title}
                                </span>
                                <span className="text-muted">
                                  {memory.summary}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <div className="order-2 md:order-1">
        <Stats counts={counts} />
      </div>
    </div>
  );
}
