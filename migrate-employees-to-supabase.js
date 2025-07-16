// Migration script to move employees from local JSON files to Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const supabaseUrl = 'https://lykhurrywtvzffbcbkdp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2h1cnJ5d3R2emZmYmNia2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTgxODA3NCwiZXhwIjoyMDY3Mzk0MDc0fQ.TS9lkYBcA1e6mcK1_6JL8-Qbt-hXuhedovWTZBVtDPk';

const supabase = createClient(supabaseUrl, supabaseKey);

// Employee data from local JSON files (matching Supabase schema)
const employees = [
  {
    name: 'Admin',
    email: 'kango@fenix.com',
    role: 'admin',
    phone: '+389-70-000-000',
    department: 'Management',
    hire_date: '2024-01-01',
    status: 'active'
  },
  {
    name: 'Petre',
    email: 'petre@fenix.com',
    role: 'worker',
    phone: '+389-70-123-456',
    department: 'Construction',
    hire_date: '2024-01-01',
    status: 'active'
  },
  {
    name: 'Ilija',
    email: 'ilija@fenix.com',
    role: 'worker',
    phone: '+389-70-234-567',
    department: 'Construction',
    hire_date: '2024-01-02',
    status: 'active'
  },
  {
    name: 'Vojne',
    email: 'vojne@fenix.com',
    role: 'worker',
    phone: '+389-70-345-678',
    department: 'Construction',
    hire_date: '2024-01-03',
    status: 'active'
  },
  {
    name: 'Dragan',
    email: 'dragan@fenix.com',
    role: 'worker',
    phone: '+389-70-456-789',
    department: 'Construction',
    hire_date: '2024-01-04',
    status: 'active'
  },
  {
    name: 'Tino',
    email: 'tino@fenix.com',
    role: 'worker',
    phone: '+389-70-567-890',
    department: 'Construction',
    hire_date: '2024-01-05',
    status: 'active'
  },
  {
    name: 'Vane',
    email: 'vane@fenix.com',
    role: 'worker',
    phone: '+389-70-678-901',
    department: 'Construction',
    hire_date: '2024-01-06',
    status: 'active'
  }
];

async function migrateEmployees() {
  console.log('🚀 Starting employee migration to Supabase...');
  
  try {
    // First, check if employees table exists and has data
    const { data: existingEmployees, error: checkError } = await supabase
      .from('employees')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error checking employees table:', checkError);
      return;
    }
    
    if (existingEmployees && existingEmployees.length > 0) {
      console.log('⚠️  Employees table already has data. Clearing existing data...');
      
      // Clear existing data
      const { error: deleteError } = await supabase
        .from('employees')
        .delete()
        .neq('email', 'kango@fenix.com'); // Keep admin
      
      if (deleteError) {
        console.error('❌ Error clearing existing data:', deleteError);
        return;
      }
      
      console.log('✅ Existing data cleared');
    }
    
    // Insert new employee data
    console.log('📝 Inserting employee data...');
    
    for (const employee of employees) {
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select();
      
      if (error) {
        console.error(`❌ Error inserting ${employee.name}:`, error);
      } else {
        console.log(`✅ Successfully inserted ${employee.name} (${employee.email})`);
      }
    }
    
    // Verify the migration
    const { data: finalEmployees, error: verifyError } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    
    if (verifyError) {
      console.error('❌ Error verifying migration:', verifyError);
      return;
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log(`📊 Total employees in database: ${finalEmployees.length}`);
    console.log('\n📋 Migrated employees:');
    finalEmployees.forEach(emp => {
      console.log(`  - ${emp.name} (${emp.email}) - ${emp.role}`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
migrateEmployees(); 