import { json } from '@sveltejs/kit';
import { pool } from '$lib/db/db';
import { protectRoute } from '$lib/server/gatekeeper';

export const handle = protectRoute('admin');

export async function GET() {
  const result = await pool.query(`
        SELECT u.id, u.email, u.name, array_agg(r.name) as roles
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        GROUP BY u.id, u.email, u.name
        ORDER BY u.id
    `);

  return json(result.rows);
}
