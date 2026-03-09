import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { login } from '@/app/lib/oauth';

export async function GET(req: NextRequest) {
  redirect(await login(req));
}
