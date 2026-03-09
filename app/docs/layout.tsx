import { Breadcrumb } from './breadcrumb';
import { Menu } from './menu';
import { Sidebar } from './sidebar';
import { Toc } from './toc';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-warm p-2 md:p-6 lg:p-8">
      <div className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-fg md:rounded-3xl">
        <header className="shrink-0 border-b border-white/10 bg-fg">
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-4">
            <div className="min-w-0 flex-1">
              <Breadcrumb />
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <a
                href="https://github.com/tigent/app"
                className="hidden rounded-xl px-3 py-2 text-sm text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:inline-flex"
              >
                GitHub
              </a>
              <a
                href="https://github.com/apps/tigent"
                className="inline-flex rounded-xl bg-white px-3 py-2 text-sm font-medium text-fg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:px-4"
              >
                Install
              </a>
              <Menu />
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-y-auto px-4 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden md:px-8 lg:px-12">
            {children}
          </main>
          <Toc />
        </div>
      </div>
    </div>
  );
}
