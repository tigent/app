import { redirect } from 'next/navigation';
import { getsession } from '@/app/lib/session';
import { Shell } from './components/shell';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getsession();
  if (!session.token) redirect('/login');

  return (
    <div className="h-screen bg-warm flex overflow-hidden p-3 gap-3">
      <Shell>{children}</Shell>
    </div>
  );
}
