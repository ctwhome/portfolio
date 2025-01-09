// https://kit.svelte.dev/docs/hooks
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { handleAuth } from "./auth";
import { protectRoute } from '$lib/server/gatekeeper';

// Handle CORS and auth middleware
const handleCORS: Handle = async ({ event, resolve }) => {
  // Skip CORS for non-auth routes
  if (!event.url.pathname.startsWith('/auth')) {
    return resolve(event);
  }

  // Add CORS headers for auth routes
  const response = await resolve(event);
  response.headers.set('Access-Control-Allow-Origin', 'https://top-sveltekit.ctwhome.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
};

// Sequence of middleware to run
// 1. CORS headers for auth routes
// 2. handleAuth - Handles authentication from @auth
// 3. protectRoute - Our gatekeeper for RBAC (no role required by default)
export const handle = sequence(handleCORS, handleAuth, protectRoute());

// Example of how to protect specific routes with roles:
// You can create additional middleware for specific routes like this:
/*
export const protectAdminRoutes: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/admin')) {
    return protectRoute(Role.ADMIN)({ event, resolve });
  }
  return resolve(event);
};

// Then add it to the sequence:
export const handle = sequence(handleAuth, protectRoute(), protectAdminRoutes);
*/
