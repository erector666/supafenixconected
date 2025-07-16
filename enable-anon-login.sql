-- Enable Anonymous Access for Login Validation
-- This script creates RLS policies that allow login validation while maintaining security

-- Enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
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

-- Create policies for employees table
CREATE POLICY "Allow login validation" ON employees
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access" ON employees
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Create policies for vehicles table
CREATE POLICY "Allow read access to vehicles" ON vehicles
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access" ON vehicles
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Create policies for work sessions table
CREATE POLICY "Allow read access to work sessions" ON work_sessions
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access" ON work_sessions
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Create policies for files table
CREATE POLICY "Allow read access to files" ON files
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access" ON files
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Create policies for materials table
CREATE POLICY "Allow read access to materials" ON materials
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access" ON materials
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('employees', 'vehicles', 'work_sessions', 'files', 'materials')
ORDER BY tablename;

-- Test the policies
SELECT 'Testing employee access...' as test;
SELECT COUNT(*) as employee_count FROM employees;

SELECT 'Testing vehicle access...' as test;
SELECT COUNT(*) as vehicle_count FROM vehicles;

SELECT 'RLS policies created successfully!' as status; 