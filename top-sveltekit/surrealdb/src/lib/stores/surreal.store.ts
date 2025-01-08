import { writable } from 'svelte/store';
import { Surreal } from 'surrealdb.js';

interface SurrealState {
  db: Surreal;
  isConnected: boolean;
  error: string | null;
}

interface SignInParams {
  namespace: string;
  database: string;
  scope: string;
  email: string;
  password: string;
}

function createSurrealStore() {
  const db = new Surreal();
  const { subscribe, set, update } = writable<SurrealState>({
    db,
    isConnected: false,
    error: null
  });

  return {
    subscribe,
    connect: async () => {
      try {
        await db.connect('https://civil-gazelle-069peoc69hv4j55gh62p9e1r40.aws-euw1.surreal.cloud/rpc');
        update(state => ({ ...state, isConnected: true, error: null }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Connection failed';
        update(state => ({ ...state, error: errorMessage }));
        throw err;
      }
    },
    signin: async ({ namespace, database, scope, email, password }: SignInParams) => {
      try {
        await db.use({ namespace, database });
        await db.signin({
          namespace,
          database,
          scope,
          email,
          password
        });
        update(state => ({ ...state, error: null }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        update(state => ({ ...state, error: errorMessage }));
        throw err;
      }
    },
    authenticate: async (token: string) => {
      try {
        console.log('Authenticating with token:', token.substring(0, 20) + '...');
        await db.use({ namespace: 'kit', database: 'surrealdb' });
        console.log('Using namespace: kit, database: surrealdb');
        await db.authenticate(token);
        console.log('Authentication successful');

        // Verify authentication
        const info = await db.info();
        console.log('Database info:', info);

        // Test a simple query
        const test = await db.query('INFO FOR DB');
        console.log('DB Info query result:', test);

        update(state => ({ ...state, error: null }));
      } catch (err) {
        console.error('Authentication error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        update(state => ({ ...state, error: errorMessage }));
        throw err;
      }
    },
    getRecords: async () => {
      try {
        console.log('Fetching records from info table...');
        // Try a direct select first
        const test = await db.select('info');
        console.log('Direct select result:', test);

        // Then try the query
        const records = await db.query<[{ result: any[] }]>('SELECT * FROM info');
        console.log('Query records:', records);

        return records[0]?.result || [];
      } catch (err) {
        console.error('Error fetching records:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch records';
        update(state => ({ ...state, error: errorMessage }));
        return [];
      }
    }
  };
}

export const surrealStore = createSurrealStore();
