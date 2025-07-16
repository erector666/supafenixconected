// Test script to verify Supabase connection and login functionality
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('employees').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
}

async function testEmployeeData() {
  console.log('\n👥 Testing employee data access...');
  
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

async function testLoginValidation() {
  console.log('\n🔐 Testing login validation...');
  
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

async function testVehicleData() {
  console.log('\n🚗 Testing vehicle data access...');
  
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

async function runAllTests() {
  console.log('🚀 Starting Supabase Login System Tests\n');
  
  const tests = [
    { name: 'Supabase Connection', test: testSupabaseConnection },
    { name: 'Employee Data Access', test: testEmployeeData },
    { name: 'Login Validation', test: testLoginValidation },
    { name: 'Vehicle Data Access', test: testVehicleData }
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
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The login system is ready.');
    console.log('\n✅ You can now test the login in the browser at: http://localhost:3000');
    console.log('📝 Test credentials:');
    console.log('   - Admin: admin@fenix.com / admin123');
    console.log('   - Worker: petre@fenix.com / petre123');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
  
  console.log('='.repeat(50));
}

// Run the tests
runAllTests().catch(console.error); 