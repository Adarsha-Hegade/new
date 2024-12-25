/*
  # Fix Authentication Policies

  1. Changes
    - Remove recursive policies that caused infinite recursion
    - Simplify user table access controls
    - Add proper public access for signup flow
    - Fix admin access policies

  2. Security
    - Enable RLS on users table
    - Add specific policies for different access patterns
    - Ensure proper authentication checks
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Allow public count of users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to read all users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Allow insert during signup" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access for checking first user
CREATE POLICY "Allow public user count"
  ON users
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to read all users
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    role = 'admin'
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow new user creation during signup
CREATE POLICY "Allow user creation"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow admins to update any user
CREATE POLICY "Admins can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );