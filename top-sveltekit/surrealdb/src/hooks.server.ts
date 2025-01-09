// https://kit.svelte.dev/docs/hooks
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { handleAuth } from "./auth";
import { protectRoute } from '$lib/server/gatekeeper';

// Handle CORS for auth routes
const handleCORS: Handle = async ({ event, resolve }) => {
  // Only apply to auth routes
  if (!event.url.pathname.startsWith('/auth')) {
    return resolve(event);
  }

  // Handle preflight requests
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': event.request.headers.get('origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-auth-return-redirect',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '3600'
      }
    });
  }

  // Handle actual request
  const response = await resolve(event);
  const origin = event.request.headers.get('origin');
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

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
