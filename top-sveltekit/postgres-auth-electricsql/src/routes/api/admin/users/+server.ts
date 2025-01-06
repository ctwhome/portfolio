import { json, error } from '@sveltejs/kit';
import { pool } from '$lib/db/db';
import { Role } from '$lib/types';
import type { RequestEvent } from './$types';

export async function GET({ locals }: RequestEvent) {
  const session = await locals.getSession();
  if (!session?.user?.id) {
    throw error(401, 'Unauthorized');
  }

  const userRole = session.user.roles?.[0];
  if (userRole !== Role.ADMIN) {
    throw error(403, 'Forbidden');
  }

  try {
    console.log('Fetching users from database...');
    const result = await pool.query(`
      SELECT
        id,
        email,
        name,
        ARRAY[role] as roles
      FROM users
      ORDER BY id
    `);

    console.log('Users fetched:', result.rows);
    return json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    throw error(500, 'Failed to fetch users');
  }
}
