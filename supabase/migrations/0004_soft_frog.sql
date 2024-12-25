-- Enable RLS but add necessary policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public access for checking if users exist
CREATE POLICY "Allow public count of users"
  ON users
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to read all users
CREATE POLICY "Allow authenticated users to read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow insert during signup
CREATE POLICY "Allow insert during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);