import { redirect } from 'next/navigation';
import { peek, stale } from '@/app/lib/oauth';
import { getsession } from '@/app/lib/session';
import { Autherror, fetchrepos } from '@/app/lib/github';
import { Shell } from './components/shell';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getsession();
  if (stale(session)) redirect('/api/auth/refresh?next=/dashboard');
  const value = peek(session);
  if (!value) redirect('/login');

  try {
    const repos = await fetchrepos(value);
    const user = {
      username: session.username || '',
      avatar: session.avatar || '',
    };

    return (
      <div className="h-screen bg-warm flex overflow-hidden p-0 md:p-3 gap-0 md:gap-3">
        <Shell repos={repos} user={user}>
          {children}
        </Shell>
      </div>
    );
  } catch (error) {
    if (!(error instanceof Autherror)) throw error;
    redirect('/api/auth/refresh?next=/dashboard');
  }
}
