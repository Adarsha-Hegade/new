/*
  # Fix RLS policies for better error handling

  1. Changes
    - Add more permissive policy for checking admin existence
    - Improve user creation policy
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public user count" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policies with better error handling
CREATE POLICY "Public can check user existence"
  ON users FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Authenticated users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Allow user creation"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow first user (admin) or admin-created users
    (NOT EXISTS (SELECT 1 FROM users)) OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);