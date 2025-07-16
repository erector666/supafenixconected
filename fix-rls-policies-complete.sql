-- Complete RLS Policy Fix for FENIX Construction Tracker
-- This script ensures anonymous access for login validation

-- First, disable RLS temporarily to clear any issues
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
DROP POLICY IF EXISTS "Allow login validation" ON employees;

DROP POLICY IF EXISTS "Allow read access to vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated full access" ON vehicles;
DROP POLICY IF EXISTS "Allow all operations on vehicles" ON vehicles;

DROP POLICY IF EXISTS "Allow read access to work sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON work_sessions;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON work_sessions;
DROP POLICY IF EXISTS "Allow authenticated full access" ON work_sessions;
DROP POLICY IF EXISTS "Allow all operations on work sessions" ON work_sessions;

DROP POLICY IF EXISTS "Allow read access to files" ON files;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON files;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON files;
DROP POLICY IF EXISTS "Allow authenticated full access" ON files;
DROP POLICY IF EXISTS "Allow all operations on files" ON files;

DROP POLICY IF EXISTS "Allow read access to materials" ON materials;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON materials;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON materials;
DROP POLICY IF EXISTS "Allow authenticated full access" ON materials;
DROP POLICY IF EXISTS "Allow all operations on materials" ON materials;

-- Now enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies for development
-- Employees table - allow all operations for now
CREATE POLICY "employees_all_access" ON employees
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Vehicles table - allow all operations for now
CREATE POLICY "vehicles_all_access" ON vehicles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Work sessions table - allow all operations for now
CREATE POLICY "work_sessions_all_access" ON work_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Files table - allow all operations for now
CREATE POLICY "files_all_access" ON files
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Materials table - allow all operations for now
CREATE POLICY "materials_all_access" ON materials
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('employees', 'vehicles', 'work_sessions', 'files', 'materials')
ORDER BY tablename, policyname;

-- Test the policies
SELECT 'Testing employee access...' as test;
SELECT COUNT(*) as employee_count FROM employees;

SELECT 'Testing vehicle access...' as test;
SELECT COUNT(*) as vehicle_count FROM vehicles;

SELECT 'Testing work sessions access...' as test;
SELECT COUNT(*) as work_sessions_count FROM work_sessions;

SELECT 'Testing files access...' as test;
SELECT COUNT(*) as files_count FROM files;

SELECT 'Testing materials access...' as test;
SELECT COUNT(*) as materials_count FROM materials;

SELECT 'All RLS policies created successfully!' as status; 