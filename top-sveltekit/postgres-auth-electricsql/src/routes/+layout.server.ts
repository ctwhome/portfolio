import type { LayoutServerLoad } from "./$types"
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
  // const session = await event.locals.auth();
  //
  // redirections if needed, but must return the session for the app to work.

  /* if (session?.user?.id) {
    if (event.url.pathname === '/') {
      throw redirect(302, '/profile');
    }
  }
  else {
    if (event.url.pathname === '/profile') {
      throw redirect(302, '/');
    }
  } */


  return {
    //! Returning the seesion is important to make sure the user the app is authenticated and make it available to the rest of the app
    //! https://authjs.dev/reference/sveltekit#managing-the-session
    // session
  }
}
// export const prerender = true
// export const ssr = false;
