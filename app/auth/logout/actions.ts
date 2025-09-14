'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');

  redirect('/auth/login');
}
