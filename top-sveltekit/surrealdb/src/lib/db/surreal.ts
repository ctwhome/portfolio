import { Surreal } from 'surrealdb.js';
import { env } from '$env/dynamic/private';

const db = new Surreal();

export async function initSurreal() {
  try {
    // Connect to the database
    await db.connect('https://civil-gazelle-069peoc69hv4j55gh62p9e1r40.aws-euw1.surreal.cloud/version');

    // Sign in as a namespace, database, or root user
    await db.signin({
      username: env.SURREAL_USER || '',
      password: env.SURREAL_PASS || '',
      scope: 'namespace',
    });

    // Select a specific namespace / database
    await db.use({
      namespace: 'kit',
      database: 'surrealdb'
    });

    return db;
  } catch (e) {
    console.error('Error initializing SurrealDB:', e);
    throw e;
  }
}

export { db };
