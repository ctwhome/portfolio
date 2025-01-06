// https://kit.svelte.dev/docs/hooks
import { env } from '$env/dynamic/private';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { handleAuth } from "./auth";
import { pool } from "$lib/db/db";

// Initialize the database connection
// console.log('🎹 DATABASE_URL', env.DATABASE_URL, env.DB_USER);

// Set the app.user_id in the database to enable row level security
const setAppUser: Handle = async ({ event, resolve }) => {
  const session = await event.locals.getSession();
  if (session?.user?.id) {
    await pool.query('SELECT set_app_user($1)', [session.user.id]);
  } else {
    await pool.query('SELECT set_app_user(NULL)');
  }
  return resolve(event);
}

export const handle = sequence(handleAuth, setAppUser);
