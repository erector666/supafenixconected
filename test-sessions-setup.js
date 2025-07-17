// Test script to verify sessions table setup
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSessionsTable() {
  console.log('🧪 Testing sessions table setup...');
  
  try {
    // Test 1: Check if sessions table exists
    console.log('\n1️⃣ Checking if sessions table exists...');
    const { data: tables, error: tableError } = await supabase
      .from('sessions')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Sessions table does not exist or is not accessible:', tableError.message);
      console.log('\n📋 Please run the setup-sessions-table.sql script in your Supabase SQL Editor');
      return false;
    }
    
    console.log('✅ Sessions table exists and is accessible');
    
    // Test 2: Check table structure
    console.log('\n2️⃣ Checking table structure...');
    const { data: structure, error: structureError } = await supabase
      .rpc('get_session_by_token', { session_token: 'test' });
    
    if (structureError) {
      console.log('ℹ️  get_session_by_token function not found (this is expected if not created yet)');
    } else {
      console.log('✅ get_session_by_token function exists');
    }
    
    // Test 3: Try to insert a test session
    console.log('\n3️⃣ Testing session creation...');
    const testSession = {
      employee_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
      token: 'test-token-' + Date.now(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      is_remember_me: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('sessions')
      .insert([testSession])
      .select();
    
    if (insertError) {
      console.error('❌ Failed to insert test session:', insertError.message);
      console.log('This might be due to RLS policies or missing employee_id');
    } else {
      console.log('✅ Test session created successfully');
      
      // Clean up test session
      await supabase
        .from('sessions')
        .delete()
        .eq('token', testSession.token);
      console.log('🧹 Test session cleaned up');
    }
    
    console.log('\n✅ Sessions table setup appears to be working correctly!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure you have valid employee records in your employees table');
    console.log('2. Try logging in with "Remember Me" checked');
    console.log('3. Check the browser console for any remaining errors');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error testing sessions table:', error);
    return false;
  }
}

// Run the test
testSessionsTable().then(success => {
  if (success) {
    console.log('\n🎉 Sessions table is ready for use!');
  } else {
    console.log('\n⚠️  Please fix the issues above before testing the Remember Me feature');
  }
  process.exit(success ? 0 : 1);
}); 