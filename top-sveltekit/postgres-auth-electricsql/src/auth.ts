import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/sveltekit/providers/google";
import Credentials from "@auth/sveltekit/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "$lib/db/db";
import { getUserRoles } from "$lib/server/gatekeeper";
import type { CustomSession } from "./app";
import bcrypt from 'bcrypt';
import Resend from "@auth/sveltekit/providers/resend";

export const { handle: handleAuth, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  adapter: PostgresAdapter(pool),
  secret: process.env.AUTH_SECRET,
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
        const { email, password } = credentials as { email: string; password: string };
        if (!email || !password) return null;

        const user = (await pool.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
        if (!user || !await bcrypt.compare(password, user.password)) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name || null,
          image: user.image || null
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session?.user || !token) return session;

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          roles: await getUserRoles(token.id as string)
        }
      } as CustomSession;
    }
  }
});
