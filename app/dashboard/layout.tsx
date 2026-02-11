import { redirect } from 'next/navigation';
import { getsession } from '@/app/lib/session';
import { fetchrepos } from '@/app/lib/github';
import { Shell } from './components/shell';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getsession();
  if (!session.token) redirect('/login');

  const repos = await fetchrepos(session.token);
  const user = { username: session.username, avatar: session.avatar };

  return (
    <div className="h-screen bg-warm flex overflow-hidden p-0 md:p-3 gap-0 md:gap-3">
      <Shell repos={repos} user={user}>
        {children}
      </Shell>
    </div>
  );
}
