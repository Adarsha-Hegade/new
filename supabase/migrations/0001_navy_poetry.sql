/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - username (text, unique) 
      - name (text)
      - phone_number (text)
      - role (text)
      - profile_photo (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - tasks
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - deadline (timestamptz)
      - status (text)
      - priority (text)
      - points (integer)
      - assigned_to (uuid, foreign key)
      - document_url (text)
      - score (integer)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - task_submissions
      - id (uuid, primary key)
      - task_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - content (text)
      - submitted_at (timestamptz)
      - auto_saved_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user roles
*/

-- Create tables
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  phone_number text,
  role text NOT NULL DEFAULT 'user',
  profile_photo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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
  score integer CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE task_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  content text,
  submitted_at timestamptz,
  auto_saved_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
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

CREATE POLICY "Allow first user or admin creation" ON users
  FOR INSERT TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM users) OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Tasks policies
CREATE POLICY "Users can read assigned tasks" ON tasks
  FOR SELECT TO authenticated
  USING (assigned_to = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can manage tasks" ON tasks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Task submissions policies
CREATE POLICY "Users can manage own submissions" ON task_submissions
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));