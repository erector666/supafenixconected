-- FENIX Construction Tracker - Complete Database Setup
-- This script creates everything from scratch

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS work_sessions CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS employees CASCADE;

-- Create employees table
CREATE TABLE employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'worker',
    phone VARCHAR(20),
    department VARCHAR(100),
    hire_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work_sessions table
CREATE TABLE work_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',
    location JSONB,
    notes TEXT,
    total_hours DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    license_plate VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create files table for tracking uploaded files
CREATE TABLE files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    size BIGINT,
    type VARCHAR(100),
    uploaded_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_work_sessions_employee_id ON work_sessions(employee_id);
CREATE INDEX idx_work_sessions_status ON work_sessions(status);
CREATE INDEX idx_work_sessions_start_time ON work_sessions(start_time);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

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

-- Create RLS policies for files table
CREATE POLICY "Allow authenticated users to read files" ON files
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert files" ON files
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update files" ON files
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete files" ON files
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO employees (name, email, role, phone, department, status) VALUES
('John Doe', 'john.doe@fenix.com', 'admin', '+389-70-123-456', 'Management', 'active'),
('Jane Smith', 'jane.smith@fenix.com', 'worker', '+389-70-234-567', 'Construction', 'active'),
('Mike Johnson', 'mike.johnson@fenix.com', 'worker', '+389-70-345-678', 'Construction', 'active'),
('Sarah Wilson', 'sarah.wilson@fenix.com', 'worker', '+389-70-456-789', 'Electrical', 'active'),
('Tom Brown', 'tom.brown@fenix.com', 'worker', '+389-70-567-890', 'Plumbing', 'active');

INSERT INTO vehicles (name, type, license_plate, status) VALUES
('FENIX Truck 1', 'Pickup Truck', 'SK-1234-AB', 'active'),
('FENIX Van 1', 'Cargo Van', 'SK-5678-CD', 'active'),
('FENIX Excavator 1', 'Excavator', 'SK-9012-EF', 'active'),
('FENIX Crane 1', 'Mobile Crane', 'SK-3456-GH', 'active');

-- Create storage bucket for work files
INSERT INTO storage.buckets (id, name, public) VALUES ('work-files', 'work-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'work-files');

CREATE POLICY "Allow authenticated users to view files" ON storage.objects
    FOR SELECT USING (auth.role() = 'authenticated' AND bucket_id = 'work-files');

CREATE POLICY "Allow authenticated users to update files" ON storage.objects
    FOR UPDATE USING (auth.role() = 'authenticated' AND bucket_id = 'work-files');

CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
    FOR DELETE USING (auth.role() = 'authenticated' AND bucket_id = 'work-files');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_sessions_updated_at BEFORE UPDATE ON work_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'FENIX Construction Tracker database setup completed successfully!' as status; 