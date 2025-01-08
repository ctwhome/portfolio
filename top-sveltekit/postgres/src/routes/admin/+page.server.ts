import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  if (!session?.user) {
    throw redirect(302, '/auth/signin');
  }

  const roles = locals.roles || [];
  if (!roles.includes('admin')) {
    throw redirect(302, '/');
  }

  return {
    user: session.user
  };
};
