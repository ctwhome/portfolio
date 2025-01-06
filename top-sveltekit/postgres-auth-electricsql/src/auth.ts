import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/sveltekit/providers/google";
import Credentials from "@auth/sveltekit/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "$lib/db/db";
import { getUserRoles } from "$lib/server/gatekeeper";
import type { Credentials as CredentialsType, CustomUser, CustomSession } from "./app";
import type { User } from "@auth/core/types";

import bcrypt from 'bcrypt';
import Resend from "@auth/sveltekit/providers/resend";

interface DbUser {
  id: number;
  email: string;
  password: string;
  name?: string | null;
}

export const { handle: handleAuth, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  adapter: PostgresAdapter(pool),
  secret: process.env.AUTH_SECRET,
  debug: false,
  session: {
    strategy: "jwt"
  },
  providers: [
    Resend({
      from: "top-sveltekit@ctwhome.com",
      name: "Chat Diamond",
    }),
    Google,
    Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        if (!credentials || !('email' in credentials) || !('password' in credentials)) {
          return null;
        }

        const { email, password } = credentials as { email: string; password: string };
        const result = await pool.query<DbUser>('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && typeof password === 'string') {
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) {
            console.log('User authorized', user);
            const authUser: CustomUser = {
              id: user.id.toString(),
              email: user.email,
              name: user.name || null
            };
            return authUser;
          }
        }
        console.log('User authorization failed');
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      const customSession = session as CustomSession;
      if (customSession.user && user) {
        const customUser = user as CustomUser;
        customSession.user.id = customUser.id;
        customSession.user.email = customUser.email || null;

        // Get user roles (if none exist, gatekeeper will treat as regular user)
        customSession.user.roles = await getUserRoles(customUser.id);
      }
      return customSession;
    },
    async signIn({ user }) {
      return !!user;
    },
  }
});
