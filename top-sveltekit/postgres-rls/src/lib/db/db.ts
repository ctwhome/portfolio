// src/lib/db.ts
import { env } from "$env/dynamic/private"
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: env.DB_HOST,          // Database host
  port: Number(env.DB_PORT),  // Database port, default to 5432
  user: env.DB_USER,          // Database user
  password: env.DB_PASSWORD,  // Database user's password
  database: env.DB_NAME,      // Database name
  ssl: env.DB_SSL === 'true', // Optional: set to 'true' if SSL is required
  max: env.MAX_CLIENTS,       // Max number of clients in the pool
  idleTimeoutMillis: env.IDLE_TIMEOUT_MILLIS, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: env.CONNECTION_TIMEOUT_MILLIS
});

// Utility function to query the database
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Close the pool gracefully when the application is shutting down
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('pg pool has ended');
    process.exit(0);
  });
});

// Utility function to query the database
// using Parameterized queries, to avoid SQL injection
// read more here: https://node-postgres.com/features/queries
/**
 *
 * @param text SQL query
 * @param params Parameters to be passed to the query
 * @param auth Auth object from locals.auth()
 * @returns json response
 */
export async function sql(text: string, params?: any[]) {
  try {
    const result = await query(text, params);
    return result.rows;
  }
  catch (error) {
    console.error('SQL function error:', error.message);
    console.error('For query:', text);

    if (error.message.includes('not extensible')) {
      console.error('Object not extensible error. Params:', params);
      console.error('Query text:', text);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};