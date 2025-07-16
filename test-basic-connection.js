// Basic Supabase connection test
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Environment Variables Check:');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
console.log('URL starts with https://:', supabaseUrl?.startsWith('https://') ? '✅ Valid' : '❌ Invalid');
console.log('Anon Key length:', supabaseAnonKey?.length || 0, 'characters');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBasicConnection() {
  console.log('\n🚀 Testing basic Supabase connection...');
  
  try {
    // Test basic connection without any table access
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Basic connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    console.log('Session:', data.session ? 'Active' : 'None');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

async function testTableAccess() {
  console.log('\n📋 Testing table access...');
  
  const tables = ['employees', 'vehicles', 'work_sessions', 'files', 'materials'];
  
  for (const table of tables) {
    try {
      console.log(`Testing ${table}...`);
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Access successful`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
}

async function main() {
  console.log('🔧 Supabase Basic Connection Test\n');
  
  const connectionOk = await testBasicConnection();
  
  if (connectionOk) {
    await testTableAccess();
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. If connection fails: Check your Supabase URL and anon key');
  console.log('2. If table access fails: RLS policies need to be disabled');
  console.log('3. Get your service role key from Supabase Dashboard > Settings > API');
}

main().catch(console.error); 