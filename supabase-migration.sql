-- FENIX Construction Tracker - Database Migration
-- Add missing columns to existing tables

-- Add license_plate column to vehicles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vehicles' AND column_name = 'license_plate'
    ) THEN
        ALTER TABLE vehicles ADD COLUMN license_plate VARCHAR(20);
    END IF;
END $$;

-- Add any other missing columns to vehicles table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vehicles' AND column_name = 'type'
    ) THEN
        ALTER TABLE vehicles ADD COLUMN type VARCHAR(100);
    END IF;
END $$;

-- Add any missing columns to employees table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'role'
    ) THEN
        ALTER TABLE employees ADD COLUMN role VARCHAR(100) DEFAULT 'worker';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'phone'
    ) THEN
        ALTER TABLE employees ADD COLUMN phone VARCHAR(20);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'department'
    ) THEN
        ALTER TABLE employees ADD COLUMN department VARCHAR(100);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'hire_date'
    ) THEN
        ALTER TABLE employees ADD COLUMN hire_date DATE DEFAULT CURRENT_DATE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'status'
    ) THEN
        ALTER TABLE employees ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
END $$;

-- Add any missing columns to work_sessions table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'work_sessions' AND column_name = 'location'
    ) THEN
        ALTER TABLE work_sessions ADD COLUMN location JSONB;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'work_sessions' AND column_name = 'notes'
    ) THEN
        ALTER TABLE work_sessions ADD COLUMN notes TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'work_sessions' AND column_name = 'total_hours'
    ) THEN
        ALTER TABLE work_sessions ADD COLUMN total_hours DECIMAL(5,2);
    END IF;
END $$;

-- Enable Row Level Security on all tables if not already enabled
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to read employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to insert employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to update employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to delete employees" ON employees;

DROP POLICY IF EXISTS "Allow authenticated users to read work sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to insert work sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to update work sessions" ON work_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to delete work sessions" ON work_sessions;

DROP POLICY IF EXISTS "Allow authenticated users to read vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated users to insert vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated users to update vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated users to delete vehicles" ON vehicles;

-- Create RLS policies for employees table
CREATE POLICY "Allow authenticated users to read employees" ON employees
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert employees" ON employees
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update employees" ON employees
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete employees" ON employees
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for work_sessions table
CREATE POLICY "Allow authenticated users to read work sessions" ON work_sessions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert work sessions" ON work_sessions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update work sessions" ON work_sessions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete work sessions" ON work_sessions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for vehicles table
CREATE POLICY "Allow authenticated users to read vehicles" ON vehicles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert vehicles" ON vehicles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update vehicles" ON vehicles
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete vehicles" ON vehicles
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data (only if tables are empty)
INSERT INTO employees (name, email, role, phone, department, status) 
SELECT * FROM (VALUES
    ('John Doe', 'john.doe@fenix.com', 'admin', '+389-70-123-456', 'Management', 'active'),
    ('Jane Smith', 'jane.smith@fenix.com', 'worker', '+389-70-234-567', 'Construction', 'active'),
    ('Mike Johnson', 'mike.johnson@fenix.com', 'worker', '+389-70-345-678', 'Construction', 'active'),
    ('Sarah Wilson', 'sarah.wilson@fenix.com', 'worker', '+389-70-456-789', 'Electrical', 'active'),
    ('Tom Brown', 'tom.brown@fenix.com', 'worker', '+389-70-567-890', 'Plumbing', 'active')
) AS v(name, email, role, phone, department, status)
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE email = v.email);

INSERT INTO vehicles (name, type, license_plate, status)
SELECT * FROM (VALUES
    ('FENIX Truck 1', 'Pickup Truck', 'SK-1234-AB', 'active'),
    ('FENIX Van 1', 'Cargo Van', 'SK-5678-CD', 'active'),
    ('FENIX Excavator 1', 'Excavator', 'SK-9012-EF', 'active'),
    ('FENIX Crane 1', 'Mobile Crane', 'SK-3456-GH', 'active')
) AS v(name, type, license_plate, status)
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE name = v.name);

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('work-files', 'work-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'work-files');

CREATE POLICY "Allow authenticated users to view files" ON storage.objects
    FOR SELECT USING (auth.role() = 'authenticated' AND bucket_id = 'work-files');

CREATE POLICY "Allow authenticated users to update files" ON storage.objects
    FOR UPDATE USING (auth.role() = 'authenticated' AND bucket_id = 'work-files');

CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
    FOR DELETE USING (auth.role() = 'authenticated' AND bucket_id = 'work-files'); 