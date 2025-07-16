// Test script using service role key to bypass RLS
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testEmployeeData() {
  console.log('👥 Testing employee data with service role...');
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('status', 'active');
    
    if (error) {
      console.error('❌ Failed to fetch employees:', error.message);
      return false;
    }
    
    console.log(`✅ Successfully fetched ${data.length} active employees`);
    console.log('📋 Employee list:');
    data.forEach(emp => {
      console.log(`   - ${emp.name} (${emp.email}) - ${emp.role}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Employee data access error:', error.message);
    return false;
  }
}

async function testVehicleData() {
  console.log('\n🚗 Testing vehicle data with service role...');
  
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*');
    
    if (error) {
      console.error('❌ Failed to fetch vehicles:', error.message);
      return false;
    }
    
    console.log(`✅ Successfully fetched ${data.length} vehicles`);
    console.log('📋 Vehicle list:');
    data.forEach(vehicle => {
      console.log(`   - ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Vehicle data access error:', error.message);
    return false;
  }
}

async function testLoginValidation() {
  console.log('\n🔐 Testing login validation with service role...');
  
  // Test with admin credentials
  const adminEmail = 'admin@fenix.com';
  const adminPassword = 'admin123';
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', adminEmail)
      .eq('password', adminPassword)
      .eq('status', 'active')
      .single();
    
    if (error) {
      console.error('❌ Login validation failed:', error.message);
      return false;
    }
    
    if (data) {
      console.log('✅ Admin login validation successful');
      console.log(`   - Name: ${data.name}`);
      console.log(`   - Role: ${data.role}`);
      console.log(`   - Status: ${data.status}`);
    } else {
      console.log('❌ Admin credentials not found');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Login validation error:', error.message);
    return false;
  }
}

async function checkRLSPolicies() {
  console.log('\n🔒 Checking RLS policies...');
  
  try {
    // Check if RLS is enabled on employees table
    const { data: rlsData, error: rlsError } = await supabase
      .rpc('get_table_rls_status', { table_name: 'employees' });
    
    if (rlsError) {
      console.log('ℹ️  Could not check RLS status directly, but this is normal');
    } else {
      console.log('ℹ️  RLS status:', rlsData);
    }
    
    // Try to get policies
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'employees');
    
    if (policiesError) {
      console.log('ℹ️  Could not check policies directly');
    } else {
      console.log(`ℹ️  Found ${policies.length} policies on employees table`);
    }
    
  } catch (error) {
    console.log('ℹ️  Policy check error (normal):', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Supabase Service Role Tests\n');
  
  const tests = [
    { name: 'Employee Data Access', test: testEmployeeData },
    { name: 'Vehicle Data Access', test: testVehicleData },
    { name: 'Login Validation', test: testLoginValidation }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    const result = await test.test();
    if (result) {
      passedTests++;
    }
  }
  
  await checkRLSPolicies();
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Data exists in Supabase.');
    console.log('\n⚠️  The issue is with RLS policies blocking anon access.');
    console.log('💡 Solutions:');
    console.log('   1. Use service role key in production (not recommended)');
    console.log('   2. Modify RLS policies to allow anon access for login');
    console.log('   3. Implement proper Supabase Auth flow');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
  
  console.log('='.repeat(50));
}

// Run the tests
runAllTests().catch(console.error); 