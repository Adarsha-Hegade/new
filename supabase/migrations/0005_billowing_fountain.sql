-- Drop existing policies
DROP POLICY IF EXISTS "check_user_existence" ON users;
DROP POLICY IF EXISTS "read_own_user_data" ON users;
DROP POLICY IF EXISTS "admin_read_all_users" ON users;
DROP POLICY IF EXISTS "create_user" ON users;
DROP POLICY IF EXISTS "update_own_profile" ON users;

-- Create simplified policies
-- Allow public access to check if admin exists
CREATE POLICY "allow_admin_check"
  ON users FOR SELECT
  TO PUBLIC
  USING (role = 'admin');

-- Allow authenticated users to read their own data
CREATE POLICY "allow_user_read"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow first user creation or admin-created users
CREATE POLICY "allow_user_creation"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM users
      WHERE role = 'admin'
      LIMIT 1
    )
  );

-- Allow users to update their own data
CREATE POLICY "allow_user_update"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);