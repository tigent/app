function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const rows = 8;
const cols = 16;
const opacities = Array.from({ length: rows * cols }).map((_, i) => {
  return Math.round((seededRandom(i + 1) * 0.6 + 0.15) * 100) / 100;
});

export function Pattern() {
  return (
    <div
      className="grid gap-1 font-mono text-lg my-8 select-none"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      aria-hidden="true"
    >
      {opacities.map((opacity, i) => (
        <span key={i} className="text-center text-fg" style={{ opacity }}>
          +
        </span>
      ))}
    </div>
  );
}
