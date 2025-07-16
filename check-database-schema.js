// Check database schema to understand the current structure
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkDatabaseSchema() {
  console.log('🔍 Checking Database Schema...\n');
  
  // Check employees table structure
  console.log('👥 Employees Table Structure:');
  try {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing employees:', error.message);
    } else if (employees && employees.length > 0) {
      console.log('✅ Employees table accessible');
      console.log('📋 Columns:', Object.keys(employees[0]));
      console.log('📄 Sample data:', employees[0]);
    } else {
      console.log('ℹ️  Employees table exists but is empty');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  
  console.log('\n🚗 Vehicles Table Structure:');
  try {
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing vehicles:', error.message);
    } else if (vehicles && vehicles.length > 0) {
      console.log('✅ Vehicles table accessible');
      console.log('📋 Columns:', Object.keys(vehicles[0]));
      console.log('📄 Sample data:', vehicles[0]);
    } else {
      console.log('ℹ️  Vehicles table exists but is empty');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  
  console.log('\n📊 Work Sessions Table Structure:');
  try {
    const { data: workSessions, error } = await supabase
      .from('work_sessions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing work_sessions:', error.message);
    } else if (workSessions && workSessions.length > 0) {
      console.log('✅ Work sessions table accessible');
      console.log('📋 Columns:', Object.keys(workSessions[0]));
    } else {
      console.log('ℹ️  Work sessions table exists but is empty');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  
  console.log('\n📁 Files Table Structure:');
  try {
    const { data: files, error } = await supabase
      .from('files')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing files:', error.message);
    } else if (files && files.length > 0) {
      console.log('✅ Files table accessible');
      console.log('📋 Columns:', Object.keys(files[0]));
    } else {
      console.log('ℹ️  Files table exists but is empty');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  
  console.log('\n🔧 Materials Table Structure:');
  try {
    const { data: materials, error } = await supabase
      .from('materials')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing materials:', error.message);
    } else if (materials && materials.length > 0) {
      console.log('✅ Materials table accessible');
      console.log('📋 Columns:', Object.keys(materials[0]));
    } else {
      console.log('ℹ️  Materials table exists but is empty');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkDatabaseSchema().catch(console.error); 