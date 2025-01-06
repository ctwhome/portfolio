-- Up Migration
-- https://authjs.dev/getting-started/adapters/pg

-- Function Definitions
DROP FUNCTION IF EXISTS set_app_user CASCADE;
CREATE OR REPLACE FUNCTION set_app_user(user_id INTEGER) RETURNS TEXT AS $$
BEGIN
    PERFORM set_config('app.user_id', user_id::TEXT, false);
    RETURN 'User set successfully';
END;
$$ LANGUAGE plpgsql;



-- Table Definitions
CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
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
  PRIMARY KEY (id)
);

CREATE TABLE sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  PRIMARY KEY (id)
);

-- Create a unique index on the email column
CREATE UNIQUE INDEX users_email_idx ON users (email);

-- Insert sample users
INSERT INTO users (name, email, password, "emailVerified", image)
VALUES ('Alice Doe', 'alice@ctwhome.com', '$2a$12$qZNxIFh/Yayqshdz.3ZH2Oy2uORW/MqDS9NlfkIZsm6xnK5ZtCyJG', '2023-10-10', 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'), -- admin
       ('Bob Sponge', 'bob@ctwhome.com', '$2a$12$qZNxIFh/Yayqshdz.3ZH2Oy2uORW/MqDS9NlfkIZsm6xnK5ZtCyJG', '2023-10-10', '/images/diamond.jpg'); -- admin

-- Grant permissions to the database user (replace 'appuser' with the actual username if different)
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO appuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON accounts TO appuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON sessions TO appuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON verification_token TO appuser;

-- Grant sequence usage for tables with SERIAL or auto-incrementing IDs
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO appuser;

-- If the users table is in a different schema, replace 'public' with the correct schema name
GRANT USAGE ON SCHEMA public TO appuser;


-- Down Migration
DROP TABLE accounts;
DROP TABLE sessions;
DROP TABLE users;
DROP TABLE verification_token;
DROP FUNCTION IF EXISTS set_app_user;
