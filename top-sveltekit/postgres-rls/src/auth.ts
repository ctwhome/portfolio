import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/sveltekit/providers/google";
import Credentials from "@auth/sveltekit/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "$lib/db/db";

import bcrypt from 'bcrypt';
import Resend from "@auth/sveltekit/providers/resend";

export const { handle: handleAuth, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  adapter: PostgresAdapter(pool),
  secret: process.env.AUTH_SECRET,
  providers: [
    Resend({
      from: "top-sveltekit@ctwhome.com",
      name: "Chat Diamond",
    }),
    Google,
    Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        // console.log('🎹 authorize credentials');
        const { email, password } = credentials;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (user) {
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) {
            console.log('User authorized', user);
            return { id: user.id, email: user.email };
          }
        }
        console.log('User authorization failed');
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id;
        session.user.email = user.email;
      }
      return session;
    },
    async signIn({ user }) {
      // console.log('🎹 signIn');
      if (user) {
        return true;
      }
      return false;
    },
  }
});
