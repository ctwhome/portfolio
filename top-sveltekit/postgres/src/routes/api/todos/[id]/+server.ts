import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { query } from '$lib/db/db';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  const session = await locals.getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { completed } = await request.json();
    if (typeof completed !== 'boolean') {
      return new Response('Invalid completed value', { status: 400 });
    }

    const result = await query(
      'UPDATE todos SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [completed, params.id, session.user.id]
    );

    if (result.rows.length === 0) {
      return new Response('Todo not found', { status: 404 });
    }

    return json(result.rows[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const session = await locals.getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
      [params.id, session.user.id]
    );

    if (result.rows.length === 0) {
      return new Response('Todo not found', { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
