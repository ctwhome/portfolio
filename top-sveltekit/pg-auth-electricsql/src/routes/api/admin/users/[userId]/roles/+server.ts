import { json, error } from '@sveltejs/kit';
import { pool } from '$lib/db/db';
import { Role } from '$lib/types';
import type { RequestEvent } from './$types';

export async function PUT({ locals, params, request }: RequestEvent) {
  const session = await locals.getSession();
  if (!session?.user?.id) {
    throw error(401, 'Unauthorized');
  }

  const userRole = session.user.roles?.[0];
  if (userRole !== Role.ADMIN) {
    throw error(403, 'Forbidden');
  }

  const userId = params.userId;
  const { role: newRole, action } = await request.json();
  console.log('Updating role:', { userId, newRole, action });

  try {
    // Update the user's role
    if (action === 'add') {
      await pool.query(
        'UPDATE users SET role = $1 WHERE id = $2',
        [newRole, userId]
      );
    } else if (action === 'remove') {
      await pool.query(
        'UPDATE users SET role = $1 WHERE id = $2',
        [Role.USER, userId]
      );
    }

    // Log the result
    const updatedUser = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [userId]
    );
    console.log('Updated user:', updatedUser.rows[0]);

    return json({ success: true });
  } catch (err) {
    console.error('Error updating user role:', err);
    throw error(500, 'Failed to update user role');
  }
}
