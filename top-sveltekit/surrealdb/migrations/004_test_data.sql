-- Add test records to the info table
DEFINE TABLE info SCHEMAFULL
  PERMISSIONS
    FOR select WHERE $auth.roles CONTAINS 'admin';

-- Add test records
CREATE info:1 SET
  title = 'Test Record 1',
  description = 'This is a test record to verify SurrealDB connection',
  created_at = time::now();

CREATE info:2 SET
  title = 'Test Record 2',
  description = 'Another test record with different data',
  created_at = time::now();
