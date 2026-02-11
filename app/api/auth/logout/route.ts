import { redirect } from 'next/navigation';
import { getsession } from '@/app/lib/session';

export async function GET() {
  const session = await getsession();
  session.destroy();
  redirect('/');
}
