import { redirect } from 'next/navigation';
import { getsession } from '@/app/lib/session';

function seededrandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const grid = Array.from({ length: 12 * 20 }).map((_, i) => {
  const r = seededrandom(i + 42);
  return r > 0.85 ? Math.round(r * 100) / 100 : 0;
});

export default async function Page() {
  const session = await getsession();
  if (session.token) redirect('/dashboard');

  return (
    <div className="h-screen bg-fg flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 grid gap-px font-mono text-sm select-none pointer-events-none"
        style={{ gridTemplateColumns: 'repeat(20, 1fr)' }}
        aria-hidden="true"
      >
        {grid.map((opacity, i) => (
          <span key={i} className="text-center text-accent" style={{ opacity }}>
            +
          </span>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-12 flex items-center gap-3">
          <svg
            className="w-8 h-8 text-accent"
            viewBox="0 0 238.758 238.758"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M238.389,91.942c-1.28-3.939-5.513-6.096-9.451-4.815l-89.925,29.219l21.004-28.91c2.435-3.351,1.691-8.041-1.66-10.476c-3.352-2.435-8.041-1.691-10.476,1.66l-21.002,28.908V12.976c0-4.142-3.358-7.5-7.5-7.5c-4.142,0-7.5,3.358-7.5,7.5v94.553L90.874,78.619c-2.435-3.351-7.124-4.094-10.476-1.659c-3.351,2.434-4.094,7.124-1.66,10.475l21.004,28.91L9.82,87.127c-3.944-1.281-8.171,0.876-9.451,4.815c-1.28,3.939,0.875,8.171,4.815,9.451l89.924,29.219l-33.987,11.043c-3.939,1.28-6.095,5.511-4.815,9.451c1.03,3.169,3.97,5.184,7.131,5.184c0.768,0,1.549-0.119,2.319-0.369l33.986-11.043l-55.577,76.496c-2.435,3.351-1.691,8.041,1.66,10.476c1.331,0.967,2.874,1.433,4.402,1.433c2.319,0,4.606-1.072,6.074-3.092l55.577-76.496v35.736c0,4.142,3.358,7.5,7.5,7.5c4.142,0,7.5-3.358,7.5-7.5v-35.735l55.577,76.495c1.467,2.02,3.754,3.092,6.074,3.092c1.528,0,3.071-0.466,4.402-1.433c3.351-2.435,4.094-7.125,1.66-10.476l-55.578-76.496l33.985,11.042c0.771,0.251,1.551,0.369,2.319,0.369c3.162,0,6.101-2.015,7.131-5.184c1.28-3.939-0.876-8.171-4.815-9.451l-33.986-11.043l89.925-29.219C237.513,100.113,239.669,95.881,238.389,91.942z" />
          </svg>
          <span className="text-white text-2xl font-semibold tracking-tight">
            Tigent
          </span>
        </div>

        <h1 className="text-white text-4xl md:text-5xl font-medium tracking-tight text-center mb-3">
          Your triage dashboard
        </h1>
        <p className="text-white/40 text-center mb-10 max-w-sm">
          See activity, manage repos, and review labeling decisions
        </p>

        <a
          href="/api/auth/login"
          className="group flex items-center gap-3 bg-white text-fg px-8 py-4 rounded-2xl text-sm font-medium hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-fg"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Sign in with GitHub
        </a>

        <div className="mt-16 flex items-center gap-6">
          <a
            href="/"
            className="text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            Home
          </a>
          <a
            href="/docs"
            className="text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            Docs
          </a>
        </div>
      </div>
    </div>
  );
}
