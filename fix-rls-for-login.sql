-- Fix RLS policies to allow current login system to work
-- This creates policies that allow anonymous access for login validation

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow read access to employees" ON employees;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON employees;
DROP POLICY IF EXISTS "Allow read access to vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Allow read access to work sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON work_sessions;
DROP POLICY IF EXISTS "Allow read access to files" ON files;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON files;
DROP POLICY IF EXISTS "Allow read access to materials" ON materials;
DROP POLICY IF EXISTS "Allow insert/update for authenticated users" ON materials;

-- Enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Create policies that allow anonymous access for login validation
-- Employees table: Allow read access for login validation, full access for authenticated users
CREATE POLICY "Allow anonymous read for login" ON employees
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access" ON employees
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Vehicles table: Allow read access for all, write access for authenticated users
CREATE POLICY "Allow anonymous read for vehicles" ON vehicles
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access" ON vehicles
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Work sessions table: Allow read access for all, write access for authenticated users
CREATE POLICY "Allow anonymous read for work sessions" ON work_sessions
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access" ON work_sessions
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Files table: Allow read access for all, write access for authenticated users
CREATE POLICY "Allow anonymous read for files" ON files
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access" ON files
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Materials table: Allow read access for all, write access for authenticated users
CREATE POLICY "Allow anonymous read for materials" ON materials
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access" ON materials
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Print confirmation
SELECT 'RLS policies updated successfully for login system!' as status; 