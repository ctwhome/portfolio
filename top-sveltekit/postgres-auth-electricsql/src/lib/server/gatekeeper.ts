import type { Handle } from '@sveltejs/kit';
import { pool } from '$lib/db/db';
import { error } from '@sveltejs/kit';

interface UserRole {
  name: string;
}

// Function to get user roles
export async function getUserRoles(userId: string | number): Promise<string[]> {
  console.log('Getting roles for user:', userId);
  const result = await pool.query<UserRole>(`
        SELECT r.name
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
    `, [userId]);
  const roles = result.rows.map((row: UserRole) => row.name);
  console.log('Roles found:', roles);
  return roles;
}

// Function to check if user has required role
export async function hasRole(userId: string | number, requiredRole: string): Promise<boolean> {
  // If the required role is 'user', any authenticated user has this role by default
  if (requiredRole === 'user') {
    return true;
  }

  const roles = await getUserRoles(userId);
  return roles.includes(requiredRole);
}

// Middleware to protect routes based on roles
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

    // Add roles to locals for use in routes
    if (userId) {
      const roles = await getUserRoles(userId);
      // If user has no explicit roles, treat them as a regular user
      event.locals.roles = roles.length > 0 ? roles : ['user'];
    }

    return resolve(event);
  };
};
