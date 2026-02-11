function indent(line: string) {
  const trimmed = line.replace(/^ +/, '');
  const spaces = line.length - trimmed.length;
  return { text: trimmed, pad: spaces * 0.6 };
}

export function Config({ content }: { content: string | null }) {
  const lines = content ? content.split('\n') : [];

  return (
    <div>
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
