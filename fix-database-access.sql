-- Complete Database Access Fix for FENIX Construction Tracker
-- This script ensures the frontend can access all database tables

-- Step 1: Disable RLS on all tables
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE files DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies to start completely fresh
DROP POLICY IF EXISTS "Allow read access to employees" ON employees;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON employees;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON employees;
DROP POLICY IF EXISTS "Allow authenticated full access" ON employees;
DROP POLICY IF EXISTS "Allow all operations on employees" ON employees;
DROP POLICY IF EXISTS "Allow login validation" ON employees;
DROP POLICY IF EXISTS "Allow public read" ON employees;

DROP POLICY IF EXISTS "Allow read access to vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated full access" ON vehicles;
DROP POLICY IF EXISTS "Allow all operations on vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow public read" ON vehicles;

DROP POLICY IF EXISTS "Allow read access to work_sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON work_sessions;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON work_sessions;
DROP POLICY IF EXISTS "Allow authenticated full access" ON work_sessions;
DROP POLICY IF EXISTS "Allow all operations on work_sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow public read" ON work_sessions;

DROP POLICY IF EXISTS "Allow read access to files" ON files;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON files;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON files;
DROP POLICY IF EXISTS "Allow authenticated full access" ON files;
DROP POLICY IF EXISTS "Allow all operations on files" ON files;
DROP POLICY IF EXISTS "Allow public read" ON files;

DROP POLICY IF EXISTS "Allow read access to materials" ON materials;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON materials;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON materials;
DROP POLICY IF EXISTS "Allow authenticated full access" ON materials;
DROP POLICY IF EXISTS "Allow all operations on materials" ON materials;
DROP POLICY IF EXISTS "Allow public read" ON materials;

-- Step 3: Grant full access to public role (for development only)
GRANT ALL ON employees TO anon;
GRANT ALL ON vehicles TO anon;
GRANT ALL ON work_sessions TO anon;
GRANT ALL ON files TO anon;
GRANT ALL ON materials TO anon;

GRANT ALL ON employees TO authenticated;
GRANT ALL ON vehicles TO authenticated;
GRANT ALL ON work_sessions TO authenticated;
GRANT ALL ON files TO authenticated;
GRANT ALL ON materials TO authenticated;

-- Step 4: Verify the changes
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('employees', 'vehicles', 'work_sessions', 'files', 'materials');

-- Step 5: Test data access
SELECT COUNT(*) as employee_count FROM employees;
SELECT COUNT(*) as vehicle_count FROM vehicles;
SELECT COUNT(*) as work_session_count FROM work_sessions;
SELECT COUNT(*) as file_count FROM files;
SELECT COUNT(*) as material_count FROM materials; 