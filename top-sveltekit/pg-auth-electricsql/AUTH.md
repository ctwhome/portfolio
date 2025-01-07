# Authentication System Documentation

## Overview

The authentication system in this SvelteKit application uses [@auth/sveltekit](https://authjs.dev/reference/sveltekit) (Auth.js) with multiple authentication providers, PostgreSQL for user data storage, and a simplified role-based access control (RBAC). The system is designed to be secure, efficient, and maintainable.

## Authentication Flow

1. **Initial Request**: When a user attempts to access the application:
   - The `handleAuth` middleware from @auth/sveltekit processes the request
   - If a valid session exists, the user proceeds
   - If no session exists, the user is redirected to sign in

2. **Sign In Process**:
   - Users can sign in through multiple providers:
     - Email (Resend provider)
     - Google OAuth
     - Username/Password (Credentials provider)
   - Each provider follows its own authentication flow

3. **Session Management**:
   - JWT (JSON Web Tokens) are used to manage sessions
   - The session contains user information and role
   - Sessions are automatically handled by @auth/sveltekit

## Authentication Providers

### 1. Email Authentication (Resend)
```typescript
Resend({
  from: "top-sveltekit@ctwhome.com",
  name: "Top-Sveltekit",
})
```
- Sends magic links for passwordless authentication
- User clicks the link to authenticate
- Secure and user-friendly

### 2. Google OAuth
```typescript
Google
```
- Allows sign in with Google accounts
- Handles OAuth 2.0 flow automatically
- Returns user profile information

### 3. Credentials (Username/Password)
```typescript
Credentials({
  async authorize(credentials) {
    // Verify email and password
    // Return user if valid
  }
})
```
- Traditional email/password authentication
- Passwords are hashed using bcrypt
- Validates against PostgreSQL database

## Database Integration

The system uses PostgreSQL for user data storage with a simplified schema:

1. **User Table Structure**:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  role VARCHAR(50)  -- Single role per user
);
```

2. **Role Management**:
- Each user has a single role (admin or user)
- Role is stored directly in the users table
- Automatic role assignment through database triggers

## Role-Based Access Control (RBAC)

1. **Type-Safe Role System**:
```typescript
// In lib/types.ts
export enum Role {
  USER = 'user',
  ADMIN = 'admin'
}
```
- Type-safe role definitions
- Shared between client and server
- Prevents typos and invalid role values

2. **Role Assignment**:
```sql
-- Automatic admin role assignment
CREATE OR REPLACE FUNCTION assign_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'ctw@ctwhome.com' THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

3. **Route Protection**:
```typescript
// In hooks.server.ts
export const handle = sequence(handleAuth, protectRoute());

// Protect admin routes
if (event.url.pathname.startsWith('/admin')) {
  return protectRoute(Role.ADMIN)({ event, resolve });
}
```

## JWT and Session Handling

1. **JWT Strategy with Role**:
```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      const userData = await pool.query('SELECT id, role FROM users WHERE id = $1', [user.id]);
      token.id = userData.id;
      token.role = userData.role || Role.USER;
    }
    return token;
  }
}
```
- Stores role in JWT token
- Avoids database queries for role checks
- Efficient session management

2. **Session Enhancement**:
```typescript
async session({ session, token }) {
  return {
    ...session,
    user: {
      ...session.user,
      id: token.id as string,
      roles: [token.role as Role] // Role from JWT token
    }
  };
}
```

## Client-Side Role Usage

1. **Type-Safe Role Checks**:
```typescript
// In components
import { Role } from '$lib/types';

if (userRole === Role.ADMIN) {
  // Show admin features
}
```

2. **Role Selection**:
```typescript
let availableRoles = [Role.USER, Role.ADMIN];

<select value={user.roles[0] || Role.USER}>
  {#each availableRoles as role}
    <option value={role}>{role}</option>
  {/each}
</select>
```

## Security Considerations

1. **Role Security**:
- Roles stored in database and JWT
- Server-side validation for all role changes
- Type-safe role handling prevents errors

2. **JWT Security**:
- Roles included in signed tokens
- Cannot be tampered with
- Validated on server

## Environment Setup

Required environment variables:
```env
AUTH_SECRET=your-secret-key
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
RESEND_API_KEY=your-resend-api-key
DATABASE_URL=your-postgres-connection-string
```

## Conclusion

This authentication system provides a secure and efficient solution with:
- Simplified role management (single role per user)
- Type-safe role handling
- Efficient JWT-based session management
- Clear separation of client and server concerns
- Maintainable and scalable design
