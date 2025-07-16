-- Complete RLS Policy Reset and Recreation
-- This script will completely reset all RLS policies and create new ones that allow the login system to work

-- First, disable RLS on all tables to reset everything
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE files DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (if any exist)
DROP POLICY IF EXISTS "Allow read access to employees" ON employees;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON employees;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON employees;
DROP POLICY IF EXISTS "Allow authenticated full access" ON employees;
DROP POLICY IF EXISTS "Allow read access to vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Allow anonymous read for vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated full access" ON vehicles;
DROP POLICY IF EXISTS "Allow read access to work sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON work_sessions;
DROP POLICY IF EXISTS "Allow anonymous read for work sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow authenticated full access" ON work_sessions;
DROP POLICY IF EXISTS "Allow read access to files" ON files;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON files;
DROP POLICY IF EXISTS "Allow anonymous read for files" ON files;
DROP POLICY IF EXISTS "Allow authenticated full access" ON files;
DROP POLICY IF EXISTS "Allow read access to materials" ON materials;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON materials;
DROP POLICY IF EXISTS "Allow anonymous read for materials" ON materials;
DROP POLICY IF EXISTS "Allow authenticated full access" ON materials;

-- Now enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Create simple policies that allow ALL access for now (for testing)
-- This will allow the login system to work while we test

-- Employees table: Allow all operations
CREATE POLICY "Allow all operations on employees" ON employees
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Vehicles table: Allow all operations
CREATE POLICY "Allow all operations on vehicles" ON vehicles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Work sessions table: Allow all operations
CREATE POLICY "Allow all operations on work sessions" ON work_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Files table: Allow all operations
CREATE POLICY "Allow all operations on files" ON files
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Materials table: Allow all operations
CREATE POLICY "Allow all operations on materials" ON materials
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Print confirmation
SELECT 'RLS policies completely reset and recreated successfully!' as status;
SELECT 'All tables now allow full access for testing.' as note; 