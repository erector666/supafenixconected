import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase service role key. Please add VITE_SUPABASE_SERVICE_ROLE_KEY to your .env file');
  console.log('\nTo get your service role key:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to Settings > API');
  console.log('3. Copy the "service_role" key (not the anon key)');
  console.log('4. Add it to your .env file as VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Employee data from your existing system
const employees = [
  { name: 'Petre', email: 'petre@fenix.com', password: 'admin123' },
  { name: 'Ilija', email: 'ilija@fenix.com', password: 'admin123' },
  { name: 'Vojne', email: 'vojne@fenix.com', password: 'admin123' },
  { name: 'Dragan', email: 'dragan@fenix.com', password: 'admin123' },
  { name: 'Tino', email: 'tino@fenix.com', password: 'admin123' },
  { name: 'Vane', email: 'vane@fenix.com', password: 'admin123' }
];

// Admin user
const admin = { name: 'Admin', email: 'kango@fenix.com', password: 'admin123' };

async function createAuthUsers() {
  console.log('Starting Supabase Auth user creation...\n');

  // Create admin user first
  console.log('Creating admin user...');
  try {
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: admin.email,
      password: admin.password,
      email_confirm: true,
      user_metadata: {
        name: admin.name,
        role: 'admin'
      }
    });

    if (adminError) {
      console.error('Error creating admin user:', adminError.message);
    } else {
      console.log(`✅ Admin user created: ${admin.email} (ID: ${adminData.user.id})`);
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }

  // Create employee users
  console.log('\nCreating employee users...');
  for (const employee of employees) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: employee.email,
        password: employee.password,
        email_confirm: true,
        user_metadata: {
          name: employee.name,
          role: 'employee'
        }
      });

      if (error) {
        console.error(`❌ Error creating user ${employee.email}:`, error.message);
      } else {
        console.log(`✅ Employee user created: ${employee.email} (ID: ${data.user.id})`);
      }
    } catch (error) {
      console.error(`❌ Error creating user ${employee.email}:`, error.message);
    }
  }

  console.log('\n🎉 Supabase Auth user creation completed!');
  console.log('\nNext steps:');
  console.log('1. Update your login form to use Supabase Auth');
  console.log('2. Test login with the created users');
  console.log('3. Optionally link auth users to employee records');
}

// Run the script
createAuthUsers().catch(console.error); 