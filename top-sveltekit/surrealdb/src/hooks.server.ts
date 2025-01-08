// https://kit.svelte.dev/docs/hooks
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { handleAuth } from "./auth";
import { protectRoute } from '$lib/server/gatekeeper';

// Sequence of middleware to run
// 1. handleAuth - Handles authentication from @auth
// 2. protectRoute - Our gatekeeper for RBAC (no role required by default)
export const handle = sequence(handleAuth, protectRoute());

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
