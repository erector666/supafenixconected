-- Fix RLS policies for employees and vehicles tables
-- This allows your current login system to work with Supabase

-- Enable RLS on employees table (if not already enabled)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all employees
CREATE POLICY "Allow read access to employees" ON employees
    FOR SELECT
    USING (true);

-- Create policy to allow insert/update for authenticated users (for future user creation)
CREATE POLICY "Allow insert/update for authenticated users" ON employees
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Enable RLS on vehicles table (if not already enabled)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all vehicles
CREATE POLICY "Allow read access to vehicles" ON vehicles
    FOR SELECT
    USING (true);

-- Create policy to allow insert/update for authenticated users
CREATE POLICY "Allow insert/update for authenticated users" ON vehicles
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Enable RLS on work_sessions table (if not already enabled)
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all work sessions
CREATE POLICY "Allow read access to work sessions" ON work_sessions
    FOR SELECT
    USING (true);

-- Create policy to allow insert/update for authenticated users
CREATE POLICY "Allow insert/update for authenticated users" ON work_sessions
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Enable RLS on files table (if not already enabled)
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all files
CREATE POLICY "Allow read access to files" ON files
    FOR SELECT
    USING (true);

-- Create policy to allow insert/update for authenticated users
CREATE POLICY "Allow insert/update for authenticated users" ON files
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Enable RLS on materials table (if not already enabled)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all materials
CREATE POLICY "Allow read access to materials" ON materials
    FOR SELECT
    USING (true);

-- Create policy to allow insert/update for authenticated users
CREATE POLICY "Allow insert/update for authenticated users" ON materials
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Print confirmation
SELECT 'RLS policies created successfully!' as status; 