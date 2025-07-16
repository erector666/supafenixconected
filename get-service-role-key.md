# Getting Your Supabase Service Role Key

## 🔑 **Step 1: Access Supabase Dashboard**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your FENIX project

## 🔑 **Step 2: Navigate to API Settings**
1. In the left sidebar, click on **"Settings"**
2. Click on **"API"**
3. You'll see two sections: **"Project API keys"** and **"Project API keys"**

## 🔑 **Step 3: Copy the Service Role Key**
1. In the **"Project API keys"** section, find **"service_role"** key
2. Click the **"Copy"** button next to it
3. This key starts with `eyJ...` and is much longer than the anon key

## 🔑 **Step 4: Update Your .env File**
1. Open your `.env` file
2. Add or update this line:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
3. Replace `your_service_role_key_here` with the actual key you copied

## 🔑 **Step 5: Test the Connection**
Run this command to test:
```bash
node test-with-service-role.js
```

## ⚠️ **Important Security Notes**
- The service role key has **full access** to your database
- **Never expose it in client-side code**
- **Only use it for server-side operations**
- Keep it secure and don't commit it to version control

## 🔍 **Alternative: Check Table Permissions**
If you still get permission errors, the issue might be:
1. Tables don't exist
2. Tables are in a different schema
3. Database permissions are set incorrectly

Let me know once you have the service role key and we can test the connection! 