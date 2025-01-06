import type { Handle } from '@sveltejs/kit';
import { pool } from '$lib/db/db';
import { error } from '@sveltejs/kit';

// Function to get user role
export async function getUserRole(userId: string | number): Promise<string> {
  console.log('Getting role for user:', userId);
  const result = await pool.query(`
    SELECT role
    FROM users
    WHERE id = $1
  `, [userId]);
  const role = result.rows[0]?.role || 'user';
  console.log('Role found:', role);
  return role;
}

// Function to check if user has required role
export async function hasRole(userId: string | number, requiredRole: string): Promise<boolean> {
  // If the required role is 'user', any authenticated user has this role by default
  if (requiredRole === 'user') {
    return true;
  }

  const role = await getUserRole(userId);
  return role === requiredRole;
}

// Middleware to protect routes based on role
export const protectRoute = (requiredRole?: string): Handle => {
  return async ({ event, resolve }) => {
    const session = await event.locals.getSession();
    const userId = session?.user?.id;

    // If route requires authentication and user is not logged in
    if (requiredRole && !userId) {
      throw error(401, 'Unauthorized');
    }

    // If role is specified (other than 'user') and user is authenticated, check for the role
    if (requiredRole && requiredRole !== 'user' && userId) {
      const hasRequiredRole = await hasRole(userId, requiredRole);
      if (!hasRequiredRole) {
        throw error(403, 'Forbidden');
      }
    }

    // Add role to locals for use in routes
    if (userId) {
      const role = await getUserRole(userId);
      // Keep roles as an array for backward compatibility
      event.locals.roles = [role];
    }

    return resolve(event);
  };
};
