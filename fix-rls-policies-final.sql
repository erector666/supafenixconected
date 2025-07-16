-- Final RLS Policy Fix - Handles existing policies properly
-- This script will ensure the login system works by creating proper policies

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('employees', 'vehicles', 'work_sessions', 'files', 'materials');

-- Disable RLS temporarily to clear any blocking policies
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE files DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow read access to employees" ON employees;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON employees;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON employees;
DROP POLICY IF EXISTS "Allow authenticated full access" ON employees;
DROP POLICY IF EXISTS "Allow all operations on employees" ON employees;

DROP POLICY IF EXISTS "Allow read access to vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Allow anonymous read for vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated full access" ON vehicles;
DROP POLICY IF EXISTS "Allow all operations on vehicles" ON vehicles;

DROP POLICY IF EXISTS "Allow read access to work sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON work_sessions;
DROP POLICY IF EXISTS "Allow anonymous read for work sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow authenticated full access" ON work_sessions;
DROP POLICY IF EXISTS "Allow all operations on work sessions" ON work_sessions;

DROP POLICY IF EXISTS "Allow read access to files" ON files;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON files;
DROP POLICY IF EXISTS "Allow anonymous read for files" ON files;
DROP POLICY IF EXISTS "Allow authenticated full access" ON files;
DROP POLICY IF EXISTS "Allow all operations on files" ON files;

DROP POLICY IF EXISTS "Allow read access to materials" ON materials;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON materials;
DROP POLICY IF EXISTS "Allow anonymous read for materials" ON materials;
DROP POLICY IF EXISTS "Allow authenticated full access" ON materials;
DROP POLICY IF EXISTS "Allow all operations on materials" ON materials;

-- Now enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Create simple policies that allow ALL access for testing
-- Employees table: Allow all operations
CREATE POLICY "employees_allow_all" ON employees
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Vehicles table: Allow all operations
CREATE POLICY "vehicles_allow_all" ON vehicles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Work sessions table: Allow all operations
CREATE POLICY "work_sessions_allow_all" ON work_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Files table: Allow all operations
CREATE POLICY "files_allow_all" ON files
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Materials table: Allow all operations
CREATE POLICY "materials_allow_all" ON materials
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('employees', 'vehicles', 'work_sessions', 'files', 'materials')
ORDER BY tablename, policyname;

-- Print confirmation
SELECT 'RLS policies successfully reset and recreated!' as status;
SELECT 'All tables now allow full access for testing.' as note; 