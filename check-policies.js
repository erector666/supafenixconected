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

async function checkPolicies() {
  console.log('🔍 Checking Current RLS Policies...\n');

  try {
    // Test employee creation
    console.log('1️⃣ Testing employee creation...');
    const testEmployee = {
      name: 'Test Employee',
      email: 'test@example.com',
      password: 'password123',
      role: 'worker',
      status: 'active',
      department: 'Construction'
    };

    const { data: createdEmployee, error: createError } = await supabase
      .from('employees')
      .insert([testEmployee])
      .select()
      .single();

    if (createError) {
      console.log('❌ Employee creation failed:', createError.message);
      console.log('Error details:', createError);
    } else {
      console.log('✅ Employee creation successful:', createdEmployee);
      
      // Clean up - delete the test employee
      await supabase
        .from('employees')
        .delete()
        .eq('email', 'test@example.com');
    }

    // Test employee update
    console.log('\n2️⃣ Testing employee update...');
    const { data: updateData, error: updateError } = await supabase
      .from('employees')
      .update({ name: 'Updated Name' })
      .eq('email', 'kango@fenix.com')
      .select()
      .single();

    if (updateError) {
      console.log('❌ Employee update failed:', updateError.message);
      console.log('Error details:', updateError);
    } else {
      console.log('✅ Employee update successful:', updateData);
    }

    // Test employee deletion
    console.log('\n3️⃣ Testing employee deletion...');
    const { error: deleteError } = await supabase
      .from('employees')
      .delete()
      .eq('email', 'nonexistent@example.com');

    if (deleteError) {
      console.log('❌ Employee deletion failed:', deleteError.message);
      console.log('Error details:', deleteError);
    } else {
      console.log('✅ Employee deletion successful (no rows affected)');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkPolicies(); 