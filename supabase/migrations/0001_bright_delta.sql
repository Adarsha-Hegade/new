/*
  # Initial Schema Setup for Data Entry Management System

  1. New Tables
    - users: Store user information and authentication
    - tasks: Manage data entry tasks and assignments
    - task_submissions: Track user submissions and progress

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Set up admin privileges

  3. Changes
    - Initial schema creation
    - Basic security policies
*/

-- Wrap everything in a transaction
DO $$ 
BEGIN

  -- Create users table if it doesn't exist
  CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    username text NOT NULL,
    name text NOT NULL,
    phone_number text,
    role text NOT NULL DEFAULT 'user',
    created_at timestamptz DEFAULT now(),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username),
    CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'))
  );

  -- Create tasks table if it doesn't exist
  CREATE TABLE IF NOT EXISTS tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

  -- Create task submissions table if it doesn't exist
  CREATE TABLE IF NOT EXISTS task_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id uuid REFERENCES tasks(id) NOT NULL,
    user_id uuid REFERENCES users(id) NOT NULL,
    content text,
    submitted_at timestamptz DEFAULT now(),
    auto_saved_at timestamptz DEFAULT now()
  );

END $$;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DO $$ 
BEGIN
  -- Users can read their own data
  CREATE POLICY "Users can read own data"
    ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

  -- Admins can read all users
  CREATE POLICY "Admin can read all users"
    ON users
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 
        FROM users 
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
END $$;

-- Create policies for tasks table
DO $$
BEGIN
  -- Users can read assigned tasks
  CREATE POLICY "Users can read assigned tasks"
    ON tasks
    FOR SELECT
    TO authenticated
    USING (
      assigned_to = auth.uid() OR 
      EXISTS (
        SELECT 1 
        FROM users 
        WHERE id = auth.uid() AND role = 'admin'
      )
    );

  -- Admins can create tasks
  CREATE POLICY "Admin can create tasks"
    ON tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 
        FROM users 
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
END $$;

-- Create policies for task submissions
DO $$
BEGIN
  -- Users can read their own submissions
  CREATE POLICY "Users can read own submissions"
    ON task_submissions
    FOR SELECT
    TO authenticated
    USING (
      user_id = auth.uid() OR 
      EXISTS (
        SELECT 1 
        FROM users 
        WHERE id = auth.uid() AND role = 'admin'
      )
    );

  -- Users can create their own submissions
  CREATE POLICY "Users can create own submissions"
    ON task_submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

  -- Users can update their own submissions
  CREATE POLICY "Users can update own submissions"
    ON task_submissions
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());
END $$;