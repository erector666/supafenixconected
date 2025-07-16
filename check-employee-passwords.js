// Check employee passwords and fix login validation
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

async function checkEmployeePasswords() {
  console.log('🔍 Checking Employee Passwords...\n');
  
  // Check all employees and their password status
  try {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('id, name, email, role, password')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching employees:', error.message);
      return;
    }
    
    console.log('📋 Employee Password Status:');
    employees.forEach(emp => {
      const hasPassword = emp.password ? '✅ Has password' : '❌ No password';
      console.log(`   - ${emp.name} (${emp.email}) - ${emp.role} - ${hasPassword}`);
    });
    
    // Test login validation with specific credentials
    console.log('\n🔐 Testing Login Validation...');
    
    // Test with admin credentials
    const testEmail = 'kango@fenix.com';
    const testPassword = 'password123';
    
    console.log(`Testing login with: ${testEmail} / ${testPassword}`);
    
    const { data: loginResult, error: loginError } = await supabase
      .from('employees')
      .select('id, name, email, role, password')
      .eq('email', testEmail)
      .eq('password', testPassword)
      .single();
    
    if (loginError) {
      console.error('❌ Login validation error:', loginError.message);
      
      // Check if the email exists
      const { data: emailCheck, error: emailError } = await supabase
        .from('employees')
        .select('email, password')
        .eq('email', testEmail);
      
      if (emailError) {
        console.error('❌ Email check error:', emailError.message);
      } else {
        console.log('📧 Email check result:', emailCheck);
      }
    } else {
      console.log('✅ Login validation successful:', loginResult);
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkEmployeePasswords().catch(console.error); 