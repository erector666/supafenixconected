-- Check current RLS status and policies
-- This will help us understand what's blocking access

-- Check if RLS is enabled on tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('employees', 'vehicles', 'work_sessions', 'files', 'materials')
ORDER BY tablename;

-- Check existing policies
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

-- Check if we can access the tables directly
SELECT 'Testing direct access to employees' as test;
SELECT COUNT(*) as employee_count FROM employees LIMIT 1;

SELECT 'Testing direct access to vehicles' as test;
SELECT COUNT(*) as vehicle_count FROM vehicles LIMIT 1; 