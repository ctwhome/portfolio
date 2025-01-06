-- Up Migration

-- Create auth tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE verification_token (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
  UNIQUE("provider", "providerAccountId")
);

-- Create roles tables
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL DEFAULT 'user',
  description TEXT
);

CREATE TABLE user_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator with full access');

-- Insert sample admin user (password: password)
INSERT INTO users (name, email, password, "emailVerified", image) VALUES
('Alice Doe', 'alice@ctwhome.com', '$2a$12$qZNxIFh/Yayqshdz.3ZH2Oy2uORW/MqDS9NlfkIZsm6xnK5ZtCyJG', '2023-10-10', 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'),
('Bob Sponge', 'bob@ctwhome.com', '$2a$12$qZNxIFh/Yayqshdz.3ZH2Oy2uORW/MqDS9NlfkIZsm6xnK5ZtCyJG', '2023-10-10', '/images/diamond.jpg');


-- Assign admin role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'alice@ctwhome.com' AND r.name = 'admin';

-- Create indexes
CREATE INDEX sessions_token_idx ON sessions ("sessionToken");
CREATE INDEX users_email_idx ON users (email);
CREATE INDEX accounts_user_id_idx ON accounts ("userId");
CREATE INDEX accounts_provider_id_idx ON accounts ("providerAccountId");

-- Down Migration
DROP TABLE user_roles;
DROP TABLE roles;
DROP TABLE accounts;
DROP TABLE sessions;
DROP TABLE users;
DROP TABLE verification_token;
