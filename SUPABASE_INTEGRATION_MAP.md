# Supabase Integration Map - FENIX Construction Tracker

## Overview
This document outlines the complete Supabase integration for the FENIX Construction Tracker application, replacing Firebase with Supabase for all backend services.

## Configuration Files

### 1. Environment Variables (`process.env.env`)
```
VITE_SUPABASE_URL=https://lykhurrywtvzffbcbkdp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[password]@lykhurrywtvzffbcbkdp.supabase.co:5432/postgres
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Supabase Configuration (`src/supabase-config.js`)
- Main Supabase client initialization
- Environment variable validation
- Export of database URL and service role key

## Service Layer Architecture

### 1. Authentication Service (`src/services/authService.js`)
**Methods:**
- `signUp(email, password, userData)` - User registration
- `signIn(email, password)` - User login
- `signOut()` - User logout
- `getCurrentUser()` - Get authenticated user
- `onAuthStateChange(callback)` - Auth state listener
- `resetPassword(email)` - Password reset
- `updateProfile(updates)` - Profile updates

**Supabase Features Used:**
- Supabase Auth
- Real-time auth state changes

### 2. Work Session Service (`src/services/workSessionService.js`)
**Methods:**
- `createWorkSession(sessionData)` - Start new work session
- `endWorkSession(sessionId, endData)` - End work session
- `getActiveSession(employeeId)` - Get current active session
- `getEmployeeSessions(employeeId, filters)` - Get employee history
- `updateWorkSession(sessionId, updates)` - Update session data
- `getAllSessions(filters)` - Admin: get all sessions
- `subscribeToSessions(callback)` - Real-time session updates

**Database Tables:**
- `work_sessions` - Main work session data
- `employees` - Employee information (joined)

### 3. User Service (`src/services/userService.js`)
**Methods:**
- `createEmployee(employeeData)` - Add new employee
- `getAllEmployees(filters)` - Get employee list
- `getEmployeeById(employeeId)` - Get specific employee
- `updateEmployee(employeeId, updates)` - Update employee
- `deleteEmployee(employeeId)` - Remove employee
- `getEmployeeStats()` - Employee statistics
- `subscribeToEmployees(callback)` - Real-time employee updates

**Database Tables:**
- `employees` - Employee master data

### 4. File Service (`src/services/fileService.js`)
**Methods:**
- `uploadFile(file, path, metadata)` - Upload to storage
- `downloadFile(path)` - Download file
- `getFileUrl(path)` - Get public URL
- `listFiles(path)` - List files in directory
- `deleteFile(path)` - Remove file
- `updateFileMetadata(path, metadata)` - Update file metadata
- `getFileMetadata(path)` - Get file information
- `createSignedUrl(path, expiresIn)` - Create signed URLs

**Storage Buckets:**
- `work-files` - Main file storage bucket

## Database Schema

### Tables Structure

#### 1. employees
```sql
CREATE TABLE employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100),
  hire_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. work_sessions
```sql
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
```

#### 3. vehicles (if needed)
```sql
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  license_plate VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Real-time Features

### 1. Work Session Updates
- Real-time notifications when sessions start/end
- Live updates for session status changes
- Location tracking updates

### 2. Employee Management
- Real-time employee list updates
- Live status changes
- Instant notifications for new employees

### 3. File Management
- Real-time file upload progress
- Live file list updates
- Storage quota monitoring

## Security & Permissions

### 1. Row Level Security (RLS)
```sql
-- Enable RLS on tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for employees
CREATE POLICY "Employees can view their own data" ON employees
  FOR SELECT USING (auth.uid()::text = id::text);

-- Policies for work sessions
CREATE POLICY "Employees can view their own sessions" ON work_sessions
  FOR SELECT USING (auth.uid()::text = employee_id::text);
```

### 2. Storage Policies
```sql
-- Storage bucket policies
CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## Testing & Validation

### 1. Connectivity Test (`test-supabase-connectivity.js`)
- Basic connection test
- Authentication verification
- Database read/write operations
- Storage operations
- Real-time subscription testing

### 2. Service Tests
- Individual service method testing
- Error handling validation
- Performance benchmarking

## Migration from Firebase

### 1. Data Migration
- Export Firebase data to JSON
- Transform data to match Supabase schema
- Import data using Supabase CLI or API

### 2. Code Updates
- Replace Firebase imports with Supabase
- Update authentication flows
- Modify real-time listeners
- Update file storage operations

## Performance Considerations

### 1. Database Optimization
- Index creation for frequently queried fields
- Query optimization for large datasets
- Connection pooling for high traffic

### 2. Storage Optimization
- File compression for uploads
- CDN integration for file delivery
- Storage bucket organization

## Monitoring & Analytics

### 1. Supabase Dashboard
- Database performance metrics
- Storage usage monitoring
- API request tracking
- Error rate monitoring

### 2. Application Monitoring
- Real-time user activity
- Session duration tracking
- File upload/download metrics
- Error tracking and reporting

## Backup & Recovery

### 1. Database Backups
- Automated daily backups
- Point-in-time recovery
- Cross-region replication

### 2. Storage Backups
- File versioning
- Disaster recovery procedures
- Data retention policies

## Future Enhancements

### 1. Advanced Features
- Multi-tenant architecture
- Advanced reporting and analytics
- Mobile app integration
- API rate limiting

### 2. Scalability
- Horizontal scaling
- Load balancing
- Caching strategies
- Microservices architecture

---

**Last Updated:** January 2025
**Version:** 1.0
**Status:** Active Development 