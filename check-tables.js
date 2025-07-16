// Check if tables exist and their RLS status
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('🔍 Checking database tables...');
  
  const tables = ['employees', 'vehicles', 'work_sessions', 'files', 'materials'];
  
  for (const table of tables) {
    try {
      console.log(`\n📋 Checking table: ${table}`);
      
      // Try to get table info
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        
        // Check if it's a permission error or table doesn't exist
        if (error.message.includes('does not exist')) {
          console.log(`   ℹ️  Table '${table}' does not exist`);
        } else if (error.message.includes('permission denied')) {
          console.log(`   ℹ️  Table '${table}' exists but access is denied`);
        }
      } else {
        console.log(`   ✅ Table '${table}' exists and is accessible`);
        console.log(`   📊 Sample data: ${data.length} rows`);
      }
      
    } catch (err) {
      console.log(`   ❌ Exception: ${err.message}`);
    }
  }
}

async function checkRLSStatus() {
  console.log('\n🔒 Checking RLS status...');
  
  try {
    // Try to get RLS status using a simple query
    const { data, error } = await supabase
      .rpc('get_table_rls_status', { table_name: 'employees' });
    
    if (error) {
      console.log('ℹ️  Could not check RLS status directly');
      console.log(`   Error: ${error.message}`);
    } else {
      console.log('✅ RLS status check successful');
      console.log(`   Data: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.log('ℹ️  RLS status check failed');
    console.log(`   Error: ${err.message}`);
  }
}

async function testSimpleConnection() {
  console.log('\n🔌 Testing basic connection...');
  
  try {
    // Try a simple query that should work
    const { data, error } = await supabase
      .from('employees')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`❌ Connection failed: ${error.message}`);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    return true;
  } catch (err) {
    console.log(`❌ Connection exception: ${err.message}`);
    return false;
  }
}

async function runChecks() {
  console.log('🚀 Starting Database Checks\n');
  
  await testSimpleConnection();
  await checkTables();
  await checkRLSStatus();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 Summary:');
  console.log('   - Check the table names in your Supabase dashboard');
  console.log('   - Verify RLS policies are applied correctly');
  console.log('   - Ensure the anon key has proper permissions');
  console.log('='.repeat(50));
}

runChecks().catch(console.error); 