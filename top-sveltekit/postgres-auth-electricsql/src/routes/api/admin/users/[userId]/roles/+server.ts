import { json, error } from '@sveltejs/kit';
import { pool } from '$lib/db/db';
import { getUserRoles } from '$lib/server/gatekeeper';
import type { RequestEvent } from './$types';

export async function PUT({ locals, params, request }: RequestEvent) {
  const session = await locals.getSession();
  if (!session?.user?.id) {
    throw error(401, 'Unauthorized');
  }

  const roles = await getUserRoles(session.user.id);
  if (!roles.includes('admin')) {
    throw error(403, 'Forbidden');
  }

  const { role, action } = await request.json();
  const userId = params.userId;

  try {
    if (action === 'add') {
      // First get the role_id
      const roleResult = await pool.query(
        'SELECT id FROM roles WHERE name = $1',
        [role]
      );

      if (roleResult.rows.length === 0) {
        throw error(400, 'Invalid role');
      }

      const roleId = roleResult.rows[0].id;

      // Check if the role assignment already exists
      const existingRole = await pool.query(
        'SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = $2',
        [userId, roleId]
      );

      if (existingRole.rows.length === 0) {
        // Add the role
        await pool.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
          [userId, roleId]
        );
      }
    } else if (action === 'remove') {
      // Remove the role
      await pool.query(
        'DELETE FROM user_roles WHERE user_id = $1 AND role_id = (SELECT id FROM roles WHERE name = $2)',
        [userId, role]
      );
    }

    return json({ success: true });
  } catch (err) {
    console.error('Error updating user role:', err);
    throw error(500, 'Failed to update user role');
  }
}
