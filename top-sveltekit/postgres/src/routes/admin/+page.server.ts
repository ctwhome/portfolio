import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Role } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  if (!session?.user) {
    throw redirect(302, '/auth/login');
  }

  const roles = locals.roles || [];
  if (!roles.includes(Role.ADMIN)) {
    throw redirect(302, '/');
  }

  return {
    user: session.user
  };
};
