import { Nav } from './components/nav';
import { Pattern } from './components/pattern';

export default function Page() {
  return (
    <main className="min-h-screen">
      <Nav />

      <section className="pt-40 pb-24 px-8 max-w-3xl mx-auto">
        <p className="font-serif italic text-5xl mb-6">Hey,</p>
        <Pattern />
        <h1 className="text-3xl md:text-4xl font-medium leading-snug mb-4">
          We help <em className="font-serif not-italic">teams</em> triage issues
          with <span className="text-accent">AI-powered labeling</span> - using
          your existing labels.
        </h1>
        <p className="text-muted italic mb-8">
          speed and accuracy is our superpower
        </p>
        <div className="flex gap-3">
          <a
            href="/docs"
            className="px-5 py-3 text-sm border border-border rounded-lg hover:bg-warm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            View Docs
          </a>
          <a
            href="https://github.com/apps/tigent"
            className="px-5 py-3 text-sm bg-fg text-bg rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Install Free
          </a>
        </div>
      </section>

      <section id="config" className="py-24 px-8">
        <div className="max-w-5xl mx-auto bg-warm rounded-3xl p-12 md:p-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-muted bg-bg px-3 py-1.5 rounded-md mb-4">
              Configuration
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mb-3">
              Simple YAML Config
            </h2>
            <p className="text-muted mb-6">
              Add to{' '}
              <code className="bg-bg px-2 py-1 rounded text-sm">
                .github/tigent.yml
              </code>
            </p>
            <a
              href="/docs/config"
              className="text-sm font-medium underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              View full documentation
            </a>
          </div>
          <pre className="bg-fg text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed overflow-x-auto">
            {`prompt: |
  you are the labeling agent
  for this repo. when in doubt,
  add support.
model: google/gemini-2.5-flash`}
          </pre>
        </div>
      </section>

      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Features</h2>
          <p className="text-muted mb-10">What Tigent can do for your team.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-fg text-bg rounded-2xl p-6 flex flex-col min-h-[200px]">
              <div className="flex gap-2 mb-4">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3.5 3.75a.25.25 0 0 1 .25-.25h13.5a.25.25 0 0 1 .25.25v10a.75.75 0 0 0 1.5 0v-10A1.75 1.75 0 0 0 17.25 2H3.75A1.75 1.75 0 0 0 2 3.75v16.5c0 .966.784 1.75 1.75 1.75h7a.75.75 0 0 0 0-1.5h-7a.25.25 0 0 1-.25-.25V3.75z" />
                  <path d="M6.25 7a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5zm-.75 4.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75zm16.28 4.53a.75.75 0 1 0-1.06-1.06l-4.97 4.97-1.97-1.97a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5.5-5.5z" />
                </svg>
              </div>
              <p className="font-medium mb-auto">
                Auto-label issues and PRs based on content analysis
              </p>
              <span className="text-sm text-bg/60 mt-4">Labeling</span>
            </div>
            <div className="bg-fg text-bg rounded-2xl p-6 flex flex-col min-h-[200px]">
              <div className="flex gap-2 mb-4">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12A9.5 9.5 0 0 1 12 2.5a9.5 9.5 0 0 1 6.55 2.6L5.1 18.55A9.48 9.48 0 0 1 2.5 12zm9.5 9.5a9.48 9.48 0 0 1-6.55-2.6L18.9 5.45A9.48 9.48 0 0 1 21.5 12a9.5 9.5 0 0 1-9.5 9.5z" />
                </svg>
              </div>
              <p className="font-medium mb-auto">
                Learn from maintainer feedback to improve over time
              </p>
              <span className="text-sm text-bg/60 mt-4">Feedback</span>
            </div>
            <div className="bg-fg text-bg rounded-2xl p-6 flex flex-col min-h-[200px]">
              <div className="flex gap-2 mb-4">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7.75 6.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM2.5 7.75a5.25 5.25 0 0 1 9.837-2.533.75.75 0 0 0 1.326-.534A6.75 6.75 0 0 0 1 7.75v1.5a6.75 6.75 0 0 0 6.75 6.75h.5a.75.75 0 0 0 0-1.5h-.5A5.25 5.25 0 0 1 2.5 9.25v-1.5zm14.5 8.5a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zm1.5 0a2.75 2.75 0 1 1-5.5 0 2.75 2.75 0 0 1 5.5 0zm2.5-1.5a5.25 5.25 0 0 0-5.25-5.25h-.5a.75.75 0 0 1 0-1.5h.5A6.75 6.75 0 0 1 23 14.75v1.5a6.75 6.75 0 0 1-6.75 6.75.75.75 0 0 1 0-1.5A5.25 5.25 0 0 0 21.5 16.25v-1.5z" />
                </svg>
              </div>
              <p className="font-medium mb-auto">
                Uses your existing GitHub labels and descriptions
              </p>
              <span className="text-sm text-bg/60 mt-4">Existing Labels</span>
            </div>
            <div className="bg-fg text-bg rounded-2xl p-6 flex flex-col min-h-[200px]">
              <div className="flex gap-2 mb-4">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-1.5 0a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z" />
                  <path d="M12 1c.266 0 .532.009.797.028.763.055 1.345.617 1.512 1.304l.352 1.45c.019.078.09.171.225.221.247.091.488.195.722.312.14.07.25.04.313.014l1.357-.562c.653-.27 1.39-.106 1.919.362a11.123 11.123 0 0 1 1.597 1.596c.47.528.633 1.266.363 1.919l-.562 1.357c-.026.063-.056.174.014.313.117.234.22.475.312.722.05.134.143.206.22.225l1.45.352c.688.167 1.25.75 1.305 1.512.038.531.038 1.063 0 1.594-.055.763-.617 1.345-1.304 1.512l-1.45.352c-.078.019-.171.09-.221.225a7.946 7.946 0 0 1-.312.722c-.07.14-.04.25-.014.313l.562 1.357c.27.653.106 1.39-.362 1.919a11.12 11.12 0 0 1-1.597 1.597c-.528.47-1.266.633-1.919.363l-1.357-.562c-.063-.026-.174-.056-.313.014a7.946 7.946 0 0 1-.722.312c-.134.05-.206.143-.225.22l-.352 1.45c-.167.688-.75 1.25-1.512 1.305a11.125 11.125 0 0 1-1.594 0c-.763-.055-1.345-.617-1.512-1.304l-.352-1.45c-.019-.078-.09-.171-.225-.221a7.946 7.946 0 0 1-.722-.312c-.14-.07-.25-.04-.313-.014l-1.357.562c-.653.27-1.39.106-1.919-.362a11.12 11.12 0 0 1-1.597-1.597c-.47-.528-.633-1.266-.363-1.919l.562-1.357c.026-.063.056-.174-.014-.313a7.946 7.946 0 0 1-.312-.722c-.05-.134-.143-.206-.22-.225l-1.45-.352C1.553 13.078.99 12.495.936 11.733a11.125 11.125 0 0 1 0-1.594c.055-.763.617-1.345 1.304-1.512l1.45-.352c.078-.019.171-.09.221-.225.091-.247.195-.488.312-.722.07-.14.04-.25.014-.313L3.675 5.66c-.27-.653-.106-1.39.362-1.919a11.12 11.12 0 0 1 1.597-1.597c.528-.47 1.266-.633 1.919-.363l1.357.562c.063.026.174.056.313-.014.234-.117.475-.22.722-.312.134-.05.206-.143.225-.22l.352-1.45c.167-.688.75-1.25 1.512-1.305.265-.019.53-.028.797-.028zm-.53 1.525a9.624 9.624 0 0 0-.542 0c-.172.012-.343.14-.389.327l-.353 1.45c-.09.373-.33.726-.677.871a6.57 6.57 0 0 0-.597.258c-.33.163-.704.19-1.063.038l-1.357-.562c-.18-.074-.375-.02-.506.091a9.62 9.62 0 0 0-1.318 1.318c-.112.131-.166.326-.091.506l.562 1.357c.152.36.125.733-.038 1.063a6.57 6.57 0 0 0-.258.597c-.145.347-.498.587-.871.677l-1.45.353c-.187.046-.315.217-.327.389a9.624 9.624 0 0 0 0 .542c.012.172.14.343.327.389l1.45.353c.373.09.726.33.871.677.076.2.162.4.258.597.163.33.19.704.038 1.063l-.562 1.357c-.074.18-.02.375.091.506.364.43.888.888 1.318 1.318.131.112.326.166.506.091l1.357-.562c.36-.152.733-.125 1.063.038.197.096.398.182.597.258.347.145.587.498.677.871l.353 1.45c.046.187.217.315.389.327.18.013.362.013.542 0 .172-.012.343-.14.389-.327l.353-1.45c.09-.373.33-.726.677-.871.2-.076.4-.162.597-.258.33-.163.704-.19 1.063-.038l1.357.562c.18.074.375.02.506-.091.43-.364.888-.888 1.318-1.318.112-.131.166-.326.091-.506l-.562-1.357c-.152-.36-.125-.733.038-1.063.096-.197.182-.398.258-.597.145-.347.498-.587.871-.677l1.45-.353c.187-.046.315-.217.327-.389a9.624 9.624 0 0 0 0-.542c-.012-.172-.14-.343-.327-.389l-1.45-.353c-.373-.09-.726-.33-.871-.677a6.57 6.57 0 0 0-.258-.597c-.163-.33-.19-.704-.038-1.063l.562-1.357c.074-.18.02-.375-.091-.506a9.62 9.62 0 0 0-1.318-1.318c-.131-.112-.326-.166-.506-.091l-1.357.562c-.36.152-.733.125-1.063-.038a6.57 6.57 0 0 0-.597-.258c-.347-.145-.587-.498-.677-.871l-.353-1.45c-.046-.187-.217-.315-.389-.327z" />
                </svg>
              </div>
              <p className="font-medium mb-auto">
                Works out of the box with just two optional config fields
              </p>
              <span className="text-sm text-bg/60 mt-4">Minimal Config</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-8 pb-0">
        <div className="max-w-5xl mx-auto bg-fg text-bg rounded-t-3xl px-8 py-12">
          <div className="flex justify-between items-start mb-8">
            <a
              href="/"
              className="font-semibold text-lg tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Tigent
            </a>
            <div className="flex gap-6">
              <a
                href="/docs"
                className="text-sm text-bg/70 hover:text-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                Docs
              </a>
              <a
                href="https://github.com/tigent/app"
                className="text-sm text-bg/70 hover:text-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                GitHub
              </a>
              <a
                href="https://github.com/apps/tigent"
                className="text-sm text-bg/70 hover:text-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                Install
              </a>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-bg/60 text-sm max-w-xs">
              Automated issue labeling for GitHub powered by AI
            </p>
            <a
              href="https://github.com/apps/tigent"
              className="px-5 py-2.5 bg-bg text-fg rounded-full text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Get Started
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
