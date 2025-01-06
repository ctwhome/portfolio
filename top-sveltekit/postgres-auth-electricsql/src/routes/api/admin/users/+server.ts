import { json, error } from '@sveltejs/kit';
import { pool } from '$lib/db/db';
import { getUserRoles } from '$lib/server/gatekeeper';
import type { RequestEvent } from './$types';

export async function GET({ locals }: RequestEvent) {
  const session = await locals.getSession();
  if (!session?.user?.id) {
    throw error(401, 'Unauthorized');
  }

  const roles = await getUserRoles(session.user.id);
  if (!roles.includes('admin')) {
    throw error(403, 'Forbidden');
  }

  try {
    console.log('Fetching users from database...');
    const result = await pool.query(`
      SELECT u.id, u.email, u.name,
        CASE
          WHEN array_agg(r.name) = '{null}' THEN '{}'::text[]
          ELSE array_agg(r.name)
        END as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      GROUP BY u.id, u.email, u.name
      ORDER BY u.id
    `);

    console.log('Users fetched:', result.rows);
    return json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    throw error(500, 'Failed to fetch users');
  }
}
