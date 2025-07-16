-- Completely disable RLS on all tables for testing
-- This will allow unrestricted access to test basic functionality

-- Disable RLS on all tables
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE files DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to ensure clean state
DROP POLICY IF EXISTS "Allow read access to employees" ON employees;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON employees;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON employees;
DROP POLICY IF EXISTS "Allow authenticated full access" ON employees;
DROP POLICY IF EXISTS "Allow all operations on employees" ON employees;

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

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('employees', 'vehicles', 'work_sessions', 'files', 'materials')
ORDER BY tablename;

-- Test direct access
SELECT 'Testing employees table access' as test;
SELECT COUNT(*) as employee_count FROM employees;

SELECT 'Testing vehicles table access' as test;
SELECT COUNT(*) as vehicle_count FROM vehicles;

SELECT 'RLS completely disabled for testing!' as status; 