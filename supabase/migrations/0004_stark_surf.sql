/*
  # Initial Schema Setup
  
  1. Tables
    - users: Store user information and roles
    - tasks: Manage task assignments and submissions
    - task_submissions: Track user submissions and auto-saves
  
  2. Security
    - Enable RLS on all tables
    - Set up policies for user roles
    - Handle first user admin setup
*/

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  phone_number text,
  role text NOT NULL DEFAULT 'user',
  profile_photo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role IN ('admin', 'user'))
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  deadline timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  points integer NOT NULL DEFAULT 0,
  assigned_to uuid REFERENCES users(id),
  document_url text,
  score integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT tasks_status_check CHECK (status IN ('pending', 'in_progress', 'completed', 'scored')),
  CONSTRAINT tasks_priority_check CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT tasks_points_check CHECK (points >= 0),
  CONSTRAINT tasks_score_check CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);

-- Create task submissions table
CREATE TABLE IF NOT EXISTS task_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid REFERENCES tasks(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  content text,
  submitted_at timestamptz,
  auto_saved_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Allow public user count" ON users
  FOR SELECT TO anon USING (true);

CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow first user creation" ON users
  FOR INSERT TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM users) OR 
    auth.uid() = id
  );

-- Tasks Policies
CREATE POLICY "Users can read assigned tasks" ON tasks
  FOR SELECT TO authenticated
  USING (
    assigned_to = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can manage tasks" ON tasks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Task Submissions Policies
CREATE POLICY "Users can manage own submissions" ON task_submissions
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Create function to check if user is first signup
CREATE OR REPLACE FUNCTION is_first_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (SELECT 1 FROM users);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;