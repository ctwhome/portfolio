import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pool } from '$lib/db/db';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    return json({ user: result.rows[0] });
  } catch (error) {
    console.error('Registration error:', error);
    return json({ error: 'An error occurred during registration' }, { status: 500 });
  }
};
