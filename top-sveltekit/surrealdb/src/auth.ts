import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/sveltekit/providers/google";
import Credentials from "@auth/sveltekit/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "$lib/db/db";
import type { CustomSession } from "./app";
import bcrypt from 'bcrypt';
import Resend from "@auth/sveltekit/providers/resend";
import { createHmac } from 'crypto';

export const { handle: handleAuth, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  adapter: PostgresAdapter(pool),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    // Prevent JWT encryption by using pass-through encode/decode
    encode: ({ token, secret = process.env.AUTH_SECRET }) => {
      if (!token) return '';

      // Create a standard JWT format with HS256 signing
      const header = { alg: 'HS256', typ: 'JWT' };
      const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
      const base64Payload = Buffer.from(JSON.stringify(token)).toString('base64url');

      // Create signature
      const signature = createHmac('sha256', secret?.toString() || '')
        .update(`${base64Header}.${base64Payload}`)
        .digest('base64url');

      return `${base64Header}.${base64Payload}.${signature}`;
    },
    decode: async ({ token, secret = process.env.AUTH_SECRET }) => {
      if (!token) return {};
      try {
        const [headerB64, payloadB64, signature] = token.split('.');

        // Verify signature
        const expectedSignature = createHmac('sha256', secret?.toString() || '')
          .update(`${headerB64}.${payloadB64}`)
          .digest('base64url');

        if (signature !== expectedSignature) {
          throw new Error('Invalid signature');
        }

        return JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
      } catch {
        return {};
      }
    },
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
        // Get user data including role on initial sign in
        const userData = (await pool.query('SELECT id, role FROM users WHERE id = $1', [user.id])).rows[0];
        token.id = userData.id;
        token.role = userData.role || 'user';
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
          roles: [token.role as string] // Use role from JWT token
        }
      } as CustomSession;
    }
  }
});
