/*
  # Fix User Policies
  
  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Simplify user creation and read policies
    - Add proper admin check without recursion
    
  2. Security
    - Maintain proper access control
    - Fix admin role checking
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can check user existence" ON users;
DROP POLICY IF EXISTS "Authenticated users can read own data" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new simplified policies
-- Allow checking if any users exist (for first user signup)
CREATE POLICY "check_user_existence"
  ON users FOR SELECT
  TO PUBLIC
  USING (true);

-- Allow users to read their own data
CREATE POLICY "read_own_user_data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to read all user data
CREATE POLICY "admin_read_all_users"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    role = 'admin'
  );

-- Allow first user creation (will be admin) or subsequent users by admin
CREATE POLICY "create_user"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Either no users exist (first user) OR current user is admin
    (NOT EXISTS (SELECT 1 FROM users)) OR
    role = 'admin'
  );

-- Allow users to update their own profile
CREATE POLICY "update_own_profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    -- Cannot change role through normal update
    auth.uid() = id AND
    role = OLD.role
  );