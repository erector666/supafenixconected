# Fix "Remember Me" Functionality

## Issue
The "Remember Me" feature is currently not working because the `sessions` table is missing from your Supabase database. This is causing the 404 error when trying to create sessions.

## Solution

### Step 1: Run the SQL Script in Supabase

1. **Open your Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Sign in and select your project

2. **Navigate to the SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Click "New Query"

3. **Copy and Paste the SQL Script**
   - Open the file `setup-sessions-table.sql` in your project
   - Copy the entire contents
   - Paste it into the SQL Editor in Supabase

4. **Run the Script**
   - Click the "Run" button (or press Ctrl+Enter)
   - Wait for the script to complete successfully

### Step 2: Verify the Setup

After running the script, you should see:
- A new `sessions` table in your database
- Proper RLS policies for security
- A cleanup function for expired sessions
- A scheduled job to clean up expired sessions automatically

### Step 3: Test the "Remember Me" Feature

1. **Restart your application** (if it's running)
2. **Try logging in** with the "Remember Me" checkbox checked
3. **Refresh the page** - you should remain logged in
4. **Close and reopen the browser** - you should still be logged in (if "Remember Me" was checked)

## What the Script Does

The SQL script creates:

1. **`sessions` table** - Stores user session data
2. **Indexes** - For better query performance
3. **RLS policies** - Ensures users can only access their own sessions
4. **Cleanup function** - Removes expired sessions automatically
5. **Scheduled job** - Runs cleanup every hour
6. **Helper function** - For retrieving session data

## Troubleshooting

If you encounter any errors:

1. **Check Supabase logs** - Look for any error messages in the SQL Editor
2. **Verify table creation** - Go to "Table Editor" and check if the `sessions` table exists
3. **Check RLS policies** - Ensure the policies were created correctly
4. **Restart your app** - Sometimes a restart is needed after database changes

## Security Features

The setup includes several security measures:

- **Row Level Security (RLS)** - Users can only access their own sessions
- **Automatic cleanup** - Expired sessions are removed automatically
- **Token-based authentication** - Secure session tokens
- **Expiration dates** - Sessions automatically expire

Once you've completed these steps, the "Remember Me" functionality should work correctly! 