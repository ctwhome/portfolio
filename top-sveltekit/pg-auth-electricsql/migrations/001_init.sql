-- Up Migration

-- Create auth tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  role VARCHAR(50)
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

-- Insert sample admin user (password: password)
INSERT INTO users (name, email, password, "emailVerified", image) VALUES
('Alice Doe', 'alice@ctwhome.com', '$2a$12$qZNxIFh/Yayqshdz.3ZH2Oy2uORW/MqDS9NlfkIZsm6xnK5ZtCyJG', '2023-10-10', 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'),
('Bob Sponge', 'bob@ctwhome.com', '$2a$12$qZNxIFh/Yayqshdz.3ZH2Oy2uORW/MqDS9NlfkIZsm6xnK5ZtCyJG', '2023-10-10', '/images/diamond.jpg');


-- Assign admin role
UPDATE users
SET role = 'admin'
WHERE email = 'alice@ctwhome.com';

-- Auto-assign admin role to specific Google user
CREATE OR REPLACE FUNCTION assign_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  RAISE NOTICE 'Trigger function called for email: %', NEW.email;

  IF NEW.email = 'ctw@ctwhome.com' THEN
    RAISE NOTICE 'Setting admin role for ctw@ctwhome.com';
    NEW.role = 'admin';  -- Using = instead of :=
  ELSE
    RAISE NOTICE 'Setting default user role';
    NEW.role = COALESCE(NEW.role, 'user');  -- Only set user if role is null
  END IF;

  RAISE NOTICE 'Final role value: %', NEW.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_assign_admin_role
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION assign_admin_role();

-- Create indexes
CREATE INDEX users_email_idx ON users (email);
CREATE INDEX accounts_user_id_idx ON accounts ("userId");
CREATE INDEX accounts_provider_id_idx ON accounts ("providerAccountId");

-- Down Migration
DROP TABLE accounts;
DROP TABLE users;
DROP TABLE verification_token;
