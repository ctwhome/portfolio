-- Define the user table for SurrealDB authentication
DEFINE TABLE user SCHEMAFULL
  PERMISSIONS
    FOR select WHERE id = $auth.id,
    FOR create, update, delete NONE;

-- Define fields for the user table
DEFINE FIELD email ON user TYPE string ASSERT string::is::email($value);
DEFINE FIELD password ON user TYPE string;
DEFINE FIELD roles ON user TYPE array;
DEFINE FIELD roles.* ON user TYPE string;

-- Create a unique index for email
DEFINE INDEX idx_user_email ON user FIELDS email UNIQUE;

-- Define record access for authentication
DEFINE SCOPE user SESSION 24h
  SIGNUP ( CREATE user SET
    email = $email,
    password = crypto::argon2::generate($password),
    roles = ['user']
  )
  SIGNIN ( SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(password, $password) );

-- Define JWT access for AuthJS tokens
DEFINE ACCESS auth_jwt ON DATABASE
  TYPE JWT
  ALGORITHM HS256
  KEY $auth_secret;

-- Define permissions for the info table
DEFINE TABLE info SCHEMAFULL
  PERMISSIONS
    FOR select WHERE $auth.roles CONTAINS 'user';

-- Create an initial user for testing
CREATE user:test SET
  email = 'test@example.com',
  password = crypto::argon2::generate('test123'),
  roles = ['user'];
