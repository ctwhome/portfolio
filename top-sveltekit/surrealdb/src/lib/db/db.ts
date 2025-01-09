// src/lib/db.ts
import { env } from "$env/dynamic/private"
import pkg from 'pg';
const { Pool } = pkg;

// Create pool with error handling
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    // Enable SSL for non-localhost connections
    rejectUnauthorized: false // Required for self-signed certificates
  },
  max: Number(env.MAX_CLIENTS) || 20,
  idleTimeoutMillis: Number(env.IDLE_TIMEOUT_MILLIS) || 30000,
  connectionTimeoutMillis: Number(env.CONNECTION_TIMEOUT_MILLIS) || 2000
});

// Add error handler to catch connection issues
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test database connection on startup
(async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT NOW()');
      console.log('Database connection successful');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

// Utility function to query the database with better error handling
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Database query error:', err);
    console.error('Query:', text);
    console.error('Parameters:', params);
    throw err;
  }
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
