import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}): Promise<Metadata> {
  const { repo } = await params;
  return { title: `Tigent - ${repo.charAt(0).toUpperCase()}${repo.slice(1)}` };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
