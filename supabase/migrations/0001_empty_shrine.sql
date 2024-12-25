/*
  # Initial Schema Setup

  1. New Tables
    - `users` - Stores user information
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `username` (text, unique)
      - `name` (text)
      - `phone_number` (text)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `tasks` - Stores task information
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `deadline` (timestamp)
      - `status` (text)
      - `priority` (text)
      - `points` (integer)
      - `assigned_to` (uuid, references users)
      - `document_url` (text)
      - `score` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `task_submissions` - Stores task submissions
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `user_id` (uuid, references users)
      - `content` (text)
      - `submitted_at` (timestamp)
      - `auto_saved_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  phone_number text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
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
  updated_at timestamptz DEFAULT now()
);

-- Create task submissions table
CREATE TABLE task_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  content text,
  submitted_at timestamptz DEFAULT now(),
  auto_saved_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can read assigned tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can create tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can read own submissions"
  ON task_submissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can create own submissions"
  ON task_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own submissions"
  ON task_submissions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());