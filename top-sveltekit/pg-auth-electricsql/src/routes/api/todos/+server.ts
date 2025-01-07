import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { query } from '$lib/db/db';

export const GET: RequestHandler = async ({ locals }) => {
  const session = await locals.getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const todos = await query(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [session.user.id]
    );
    return json(todos.rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await locals.getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { title } = await request.json();
    if (!title) {
      return new Response('Title is required', { status: 400 });
    }

    const result = await query(
      'INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *',
      [title, session.user.id]
    );
    return json(result.rows[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
