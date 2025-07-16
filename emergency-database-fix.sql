-- EMERGENCY DATABASE ACCESS FIX
-- This script completely bypasses all RLS restrictions for development

-- Step 1: Completely disable RLS on all tables
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE files DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies without exception
DROP POLICY IF EXISTS "Allow read access to employees" ON employees;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON employees;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON employees;
DROP POLICY IF EXISTS "Allow authenticated full access" ON employees;
DROP POLICY IF EXISTS "Allow all operations on employees" ON employees;
DROP POLICY IF EXISTS "Allow login validation" ON employees;
DROP POLICY IF EXISTS "Allow public read" ON employees;
DROP POLICY IF EXISTS "Enable read access for all users" ON employees;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON employees;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON employees;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON employees;

DROP POLICY IF EXISTS "Allow read access to vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated full access" ON vehicles;
DROP POLICY IF EXISTS "Allow all operations on vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow public read" ON vehicles;
DROP POLICY IF EXISTS "Enable read access for all users" ON vehicles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON vehicles;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON vehicles;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON vehicles;

DROP POLICY IF EXISTS "Allow read access to work_sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON work_sessions;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON work_sessions;
DROP POLICY IF EXISTS "Allow authenticated full access" ON work_sessions;
DROP POLICY IF EXISTS "Allow all operations on work_sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow public read" ON work_sessions;
DROP POLICY IF EXISTS "Enable read access for all users" ON work_sessions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON work_sessions;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON work_sessions;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON work_sessions;

DROP POLICY IF EXISTS "Allow read access to files" ON files;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON files;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON files;
DROP POLICY IF EXISTS "Allow authenticated full access" ON files;
DROP POLICY IF EXISTS "Allow all operations on files" ON files;
DROP POLICY IF EXISTS "Allow public read" ON files;
DROP POLICY IF EXISTS "Enable read access for all users" ON files;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON files;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON files;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON files;

DROP POLICY IF EXISTS "Allow read access to materials" ON materials;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON materials;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON materials;
DROP POLICY IF EXISTS "Allow authenticated full access" ON materials;
DROP POLICY IF EXISTS "Allow all operations on materials" ON materials;
DROP POLICY IF EXISTS "Allow public read" ON materials;
DROP POLICY IF EXISTS "Enable read access for all users" ON materials;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON materials;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON materials;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON materials;

-- Step 3: Grant ALL permissions to anon and authenticated roles
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Step 4: Grant specific table permissions
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

-- Step 5: Grant schema usage
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 6: Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity = false THEN '✅ RLS DISABLED'
        ELSE '❌ RLS ENABLED'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('employees', 'vehicles', 'work_sessions', 'files', 'materials');

-- Step 7: Test data access
SELECT 'Testing employees table...' as test;
SELECT COUNT(*) as employee_count FROM employees;

SELECT 'Testing vehicles table...' as test;
SELECT COUNT(*) as vehicle_count FROM vehicles;

SELECT 'Testing work_sessions table...' as test;
SELECT COUNT(*) as work_session_count FROM work_sessions;

SELECT 'Testing files table...' as test;
SELECT COUNT(*) as file_count FROM files;

SELECT 'Testing materials table...' as test;
SELECT COUNT(*) as material_count FROM materials;

-- Step 8: Show current policies (should be empty)
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('employees', 'vehicles', 'work_sessions', 'files', 'materials'); 