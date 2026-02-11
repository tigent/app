'use client';

import { useEffect, useState } from 'react';

function indent(line: string) {
  const trimmed = line.replace(/^ +/, '');
  const spaces = line.length - trimmed.length;
  return { text: trimmed, pad: spaces * 0.6 };
}

export function Config({ repo, owner }: { repo: string; owner: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/dashboard/config?repo=${encodeURIComponent(repo)}&owner=${encodeURIComponent(owner)}`,
    )
      .then(r => r.json())
      .then(data => {
        setContent(data.content);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repo, owner]);

  if (loading) {
    return <div className="bg-warm rounded-2xl h-24 animate-pulse" />;
  }

  const lines = content ? content.split('\n') : [];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Configuration</h3>
      {lines.length > 0 ? (
        <div className="bg-warm rounded-2xl p-6 space-y-0">
          {lines.map((line, i) => {
            if (line.trim() === '') return <div key={i} className="h-4" />;
            const { text, pad } = indent(line);
            return (
              <p
                key={i}
                className="text-sm text-fg/80 font-mono leading-relaxed"
                style={{ paddingLeft: `${pad}em` }}
              >
                {text}
              </p>
            );
          })}
        </div>
      ) : (
        <div className="border border-border rounded-2xl p-6 text-center">
          <p className="text-muted text-sm">Using defaults</p>
        </div>
      )}
    </div>
  );
}
