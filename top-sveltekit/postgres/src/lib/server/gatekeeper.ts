import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

import { Role } from '$lib/types';

// Function to check if user has required role
function hasRequiredRole(userRole: string, requiredRole: Role): boolean {
  // Any authenticated user has USER role
  if (requiredRole === Role.USER) {
    return true;
  }
  return userRole === requiredRole;
}

// Middleware to protect routes based on role
export const protectRoute = (requiredRole?: Role): Handle => {
  return async ({ event, resolve }) => {
    const session = await event.locals.getSession();

    // If route requires authentication and user is not logged in
    if (requiredRole && !session?.user?.id) {
      throw error(401, 'Unauthorized');
    }

    if (session?.user) {
      // Get role from session (set in JWT token)
      const userRole = session.user.roles?.[0] || Role.USER;

      // Check role if required
      if (requiredRole && !hasRequiredRole(userRole, requiredRole)) {
        throw error(403, 'Forbidden');
      }

      // Set role in locals for use in routes
      event.locals.roles = [userRole];
    }

    return resolve(event);
  };
};
