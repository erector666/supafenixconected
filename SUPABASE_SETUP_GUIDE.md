# Supabase Setup Guide - FENIX Construction Tracker

## 🚀 Quick Setup Instructions

### Step 1: Access Your Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project: `lykhurrywtvzffbcbkdp`

### Step 2: Set Up Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire content from `supabase-schema.sql`
4. Click **Run** to execute the schema

### Step 3: Verify Tables Created
1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - `employees`
   - `work_sessions`
   - `vehicles`
   - `files`

### Step 4: Check Sample Data
1. Click on the `employees` table
2. You should see 5 sample employees
3. Click on the `vehicles` table
4. You should see 4 sample vehicles

### Step 5: Verify Storage Bucket
1. Go to **Storage** in your Supabase dashboard
2. You should see a `work-files` bucket
3. The bucket should be set to **Public**

### Step 6: Test Connectivity
1. In your project directory, run:
   ```bash
   npm install
   npm test
   ```

## 🔧 Detailed Configuration

### Database Tables

#### employees
- **id**: UUID (Primary Key)
- **name**: VARCHAR(255) - Employee full name
- **email**: VARCHAR(255) - Unique email address
- **role**: VARCHAR(100) - 'admin' or 'worker'
- **phone**: VARCHAR(20) - Phone number
- **department**: VARCHAR(100) - Department name
- **hire_date**: DATE - Employment start date
- **status**: VARCHAR(20) - 'active' or 'inactive'
- **created_at**: TIMESTAMP - Record creation time
- **updated_at**: TIMESTAMP - Last update time

#### work_sessions
- **id**: UUID (Primary Key)
- **employee_id**: UUID (Foreign Key to employees)
- **start_time**: TIMESTAMP - Session start time
- **end_time**: TIMESTAMP - Session end time
- **status**: VARCHAR(20) - 'active' or 'completed'
- **location**: JSONB - GPS coordinates and address
- **notes**: TEXT - Session notes
- **total_hours**: DECIMAL(5,2) - Calculated work hours
- **created_at**: TIMESTAMP - Record creation time
- **updated_at**: TIMESTAMP - Last update time

#### vehicles
- **id**: UUID (Primary Key)
- **name**: VARCHAR(255) - Vehicle name
- **type**: VARCHAR(100) - Vehicle type
- **license_plate**: VARCHAR(20) - License plate number
- **status**: VARCHAR(20) - 'active' or 'inactive'
- **created_at**: TIMESTAMP - Record creation time
- **updated_at**: TIMESTAMP - Last update time

#### files
- **id**: UUID (Primary Key)
- **name**: VARCHAR(255) - File name
- **path**: VARCHAR(500) - Storage path
- **size**: BIGINT - File size in bytes
- **type**: VARCHAR(100) - File MIME type
- **uploaded_by**: UUID (Foreign Key to employees)
- **metadata**: JSONB - Additional file metadata
- **created_at**: TIMESTAMP - Upload time

### Row Level Security (RLS)

All tables have RLS enabled with policies that allow:
- **SELECT**: All authenticated users can read data
- **INSERT**: All authenticated users can create records
- **UPDATE**: All authenticated users can update records
- **DELETE**: All authenticated users can delete records

### Storage Configuration

#### work-files Bucket
- **Public**: Yes (files are publicly accessible)
- **File Size Limit**: 50MB (default)
- **Allowed MIME Types**: All types allowed

### Sample Data

The schema includes sample data for testing:

#### Employees
1. John Doe (admin) - Management
2. Jane Smith (worker) - Construction
3. Mike Johnson (worker) - Construction
4. Sarah Wilson (worker) - Electrical
5. Tom Brown (worker) - Plumbing

#### Vehicles
1. FENIX Truck 1 - Pickup Truck
2. FENIX Van 1 - Cargo Van
3. FENIX Excavator 1 - Excavator
4. FENIX Crane 1 - Mobile Crane

## 🧪 Testing Your Setup

### Run Connectivity Test
```bash
npm test
```

Expected output:
```
🔍 Testing Supabase Connectivity...

1. Testing basic connection...
✅ Connection successful

2. Testing authentication...
ℹ️  Not authenticated (expected): Auth session missing!

3. Testing database read...
✅ Database read successful - Found 5 employees

4. Testing database write...
✅ Database write successful
✅ Test cleanup successful

5. Testing storage operations...
✅ Storage list successful - Found 0 files

6. Testing real-time subscriptions...
✅ Real-time subscription created
✅ Real-time subscription removed

🎉 Supabase connectivity test completed!
```

### Test Authentication
1. Create a test user account
2. Try signing in with the app
3. Verify user data is stored in the `auth.users` table

### Test File Upload
1. Try uploading a file through the app
2. Check the `work-files` bucket in Storage
3. Verify file metadata in the `files` table

## 🔒 Security Considerations

### Row Level Security
- All tables have RLS enabled
- Policies require authentication
- Users can only access data they're authorized to see

### API Security
- Use environment variables for sensitive data
- Never expose service role key in client code
- Use anon key for client-side operations

### Storage Security
- Files are publicly accessible (for simplicity)
- Consider implementing signed URLs for sensitive files
- Monitor storage usage and implement quotas

## 🚨 Troubleshooting

### Permission Denied Errors
- Ensure RLS policies are created correctly
- Check that user is authenticated
- Verify table names match exactly

### Connection Errors
- Check environment variables are set correctly
- Verify Supabase URL and anon key
- Ensure project is active and not paused

### Storage Errors
- Verify `work-files` bucket exists
- Check bucket is set to public
- Ensure storage policies are created

### Authentication Errors
- Check email confirmation settings
- Verify password requirements
- Test with simple email/password combination

## 📞 Support

If you encounter issues:
1. Check the Supabase dashboard logs
2. Review the connectivity test output
3. Verify all environment variables are set
4. Ensure database schema is applied correctly

## 🔄 Next Steps

After successful setup:
1. Test all app features with the new backend
2. Create additional user accounts
3. Upload test files
4. Create work sessions
5. Test real-time updates
6. Deploy to production

---

**Last Updated:** January 2025
**Version:** 1.0 