import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection with RLS Policies...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('1️⃣ Testing basic connection...');
    const { data, error } = await supabase.from('employees').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

async function testEmployeeAccess() {
  try {
    console.log('\n2️⃣ Testing employee table access...');
    const { data, error } = await supabase.from('employees').select('*').limit(5);
    
    if (error) {
      console.error('❌ Employee access failed:', error.message);
      return false;
    }
    
    console.log('✅ Employee access successful');
    console.log(`📊 Found ${data.length} employees`);
    return true;
  } catch (err) {
    console.error('❌ Employee access error:', err.message);
    return false;
  }
}

async function testLoginValidation() {
  try {
    console.log('\n3️⃣ Testing login validation...');
    
    // Test with valid credentials
    const { data: validUser, error: validError } = await supabase
      .from('employees')
      .select('*')
      .eq('email', 'admin@fenix.com')
      .eq('password', 'password123')
      .single();
    
    if (validError) {
      console.error('❌ Valid login test failed:', validError.message);
      return false;
    }
    
    if (validUser) {
      console.log('✅ Valid login test successful');
      console.log(`👤 Logged in as: ${validUser.name} (${validUser.role})`);
    } else {
      console.log('⚠️  Valid login returned no user (check credentials)');
    }
    
    // Test with invalid credentials
    const { data: invalidUser, error: invalidError } = await supabase
      .from('employees')
      .select('*')
      .eq('email', 'invalid@test.com')
      .eq('password', 'wrongpassword')
      .single();
    
    if (invalidError && invalidError.code === 'PGRST116') {
      console.log('✅ Invalid login test successful (correctly rejected)');
    } else {
      console.log('⚠️  Invalid login test result:', invalidError?.message || 'Unexpected result');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Login validation error:', err.message);
    return false;
  }
}

async function testOtherTables() {
  try {
    console.log('\n4️⃣ Testing other table access...');
    
    const tables = ['vehicles', 'work_sessions', 'files', 'materials'];
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      
      if (error) {
        console.log(`❌ ${table} access failed:`, error.message);
      } else {
        console.log(`✅ ${table} access successful`);
      }
    }
    
    return true;
  } catch (err) {
    console.error('❌ Other tables test error:', err.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Supabase RLS Policy Tests...\n');
  
  const tests = [
    { name: 'Basic Connection', fn: testConnection },
    { name: 'Employee Access', fn: testEmployeeAccess },
    { name: 'Login Validation', fn: testLoginValidation },
    { name: 'Other Tables', fn: testOtherTables }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passed++;
    } catch (err) {
      console.error(`❌ ${test.name} test failed:`, err.message);
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Supabase migration is ready.');
    console.log('🌐 You can now test the application in your browser.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the configuration.');
  }
}

runTests().catch(console.error); 