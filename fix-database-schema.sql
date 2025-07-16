-- Fix Database Schema for FENIX Construction Tracker
-- This script adds missing columns and fixes the database structure

-- Add password column to employees table for login validation
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update existing employees with default passwords (for testing)
-- In production, these should be properly hashed passwords
UPDATE employees 
SET password = 'password123' 
WHERE password IS NULL;

-- Add any other missing columns that might be needed
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);

-- Verify the changes
SELECT 'Employees table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'employees' 
ORDER BY ordinal_position;

SELECT 'Sample employee data:' as info;
SELECT id, name, email, role, status, password IS NOT NULL as has_password
FROM employees 
LIMIT 3; 