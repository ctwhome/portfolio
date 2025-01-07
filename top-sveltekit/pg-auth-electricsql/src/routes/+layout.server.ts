import type { LayoutServerLoad } from "./$types"
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth();

  // Add redirections if needed
  if (!session?.user && event.url.pathname === '/profile') {
    throw redirect(302, '/');
  }

  return {
    session
  }
}
// export const prerender = true
// export const ssr = false;
