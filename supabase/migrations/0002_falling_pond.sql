/*
  # Fix RLS policies for first user signup

  1. Changes
    - Drop existing policies on users table
    - Add new policies that properly handle first user signup
    - Fix admin user creation logic
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public user count" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow first user or admin creation" ON users;

-- Create new policies
-- Allow anyone to check if users exist (needed for first user check)
CREATE POLICY "Allow public user count"
  ON users FOR SELECT
  TO PUBLIC
  USING (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to read all users
CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Allow first user signup or admin-created users
CREATE POLICY "Allow user creation"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Either no users exist (first user) OR the creating user is an admin
    (NOT EXISTS (SELECT 1 FROM users)) OR
    (EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);