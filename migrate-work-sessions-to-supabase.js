import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment variables loaded:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample work sessions data (this would come from your local state)
const sampleWorkSessions = [
  {
    employee_id: 1,
    employee_name: 'Petre',
    start_time: '2025-01-15T08:00:00Z',
    start_location: {
      latitude: 42.0022,
      longitude: 21.4255,
      timestamp: '2025-01-15T08:00:00Z'
    },
    vehicle_id: 1,
    vehicle_name: 'Van #1',
    vehicle_plate: 'ABC-123',
    gas_amount: 25.5,
    work_description: 'Foundation work at Skopje Mall',
    status: 'completed',
    end_time: '2025-01-15T16:00:00Z',
    end_location: {
      latitude: 42.0022,
      longitude: 21.4255,
      timestamp: '2025-01-15T16:00:00Z'
    },
    total_hours: 8.0,
    breaks: [
      {
        start: '2025-01-15T12:00:00Z',
        end: '2025-01-15T12:30:00Z',
        location: {
          latitude: 42.0022,
          longitude: 21.4255
        }
      }
    ],
    screenshots: [
      {
        id: 1,
        timestamp: '2025-01-15T10:00:00Z',
        location: {
          latitude: 42.0022,
          longitude: 21.4255
        },
        type: 'work_progress',
        fileId: 1
      }
    ],
    location_history: [
      {
        latitude: 42.0022,
        longitude: 21.4255,
        timestamp: '2025-01-15T08:00:00Z'
      },
      {
        latitude: 42.0023,
        longitude: 21.4256,
        timestamp: '2025-01-15T10:00:00Z'
      },
      {
        latitude: 42.0022,
        longitude: 21.4255,
        timestamp: '2025-01-15T16:00:00Z'
      }
    ]
  },
  {
    employee_id: 2,
    employee_name: 'Ilija',
    start_time: '2025-01-15T07:30:00Z',
    start_location: {
      latitude: 42.0025,
      longitude: 21.4260,
      timestamp: '2025-01-15T07:30:00Z'
    },
    vehicle_id: 2,
    vehicle_name: 'Van #2',
    vehicle_plate: 'DEF-456',
    gas_amount: 30.0,
    work_description: 'Steel reinforcement at Residential Complex',
    status: 'working',
    breaks: [],
    screenshots: [],
    location_history: [
      {
        latitude: 42.0025,
        longitude: 21.4260,
        timestamp: '2025-01-15T07:30:00Z'
      }
    ]
  },
  {
    employee_id: 3,
    employee_name: 'Vojne',
    start_time: '2025-01-14T08:00:00Z',
    start_location: {
      latitude: 42.0018,
      longitude: 21.4250,
      timestamp: '2025-01-14T08:00:00Z'
    },
    vehicle_id: 3,
    vehicle_name: 'Truck #1',
    vehicle_plate: 'GHI-789',
    gas_amount: 45.0,
    work_description: 'Material delivery and site preparation',
    status: 'completed',
    end_time: '2025-01-14T17:00:00Z',
    end_location: {
      latitude: 42.0018,
      longitude: 21.4250,
      timestamp: '2025-01-14T17:00:00Z'
    },
    total_hours: 9.0,
    breaks: [
      {
        start: '2025-01-14T12:00:00Z',
        end: '2025-01-14T12:30:00Z',
        location: {
          latitude: 42.0018,
          longitude: 21.4250
        }
      }
    ],
    screenshots: [
      {
        id: 2,
        timestamp: '2025-01-14T14:00:00Z',
        location: {
          latitude: 42.0018,
          longitude: 21.4250
        },
        type: 'work_progress',
        fileId: 2
      }
    ],
    location_history: [
      {
        latitude: 42.0018,
        longitude: 21.4250,
        timestamp: '2025-01-14T08:00:00Z'
      },
      {
        latitude: 42.0019,
        longitude: 21.4251,
        timestamp: '2025-01-14T14:00:00Z'
      },
      {
        latitude: 42.0018,
        longitude: 21.4250,
        timestamp: '2025-01-14T17:00:00Z'
      }
    ]
  }
];

async function migrateWorkSessions() {
  console.log('🚀 Starting work sessions migration to Supabase...');
  
  try {
    // First, let's check if the work_sessions table exists
    console.log('📋 Checking work_sessions table...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('work_sessions')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Error checking work_sessions table:', tableError);
      console.log('💡 Please make sure the work_sessions table exists in your Supabase database');
      return;
    }
    
    console.log('✅ work_sessions table exists');
    
    // Clear existing work sessions (if any)
    console.log('🧹 Clearing existing work sessions...');
    const { error: deleteError } = await supabase
      .from('work_sessions')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (deleteError) {
      console.error('❌ Error clearing work sessions:', deleteError);
      return;
    }
    
    console.log('✅ Cleared existing work sessions');
    
    // Insert sample work sessions
    console.log('📤 Inserting work sessions...');
    const { data: insertedSessions, error: insertError } = await supabase
      .from('work_sessions')
      .insert(sampleWorkSessions)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting work sessions:', insertError);
      return;
    }
    
    console.log(`✅ Successfully migrated ${insertedSessions.length} work sessions`);
    
    // Verify the migration
    console.log('🔍 Verifying migration...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('work_sessions')
      .select('*')
      .order('start_time', { ascending: false });
    
    if (verifyError) {
      console.error('❌ Error verifying migration:', verifyError);
      return;
    }
    
    console.log(`✅ Verification successful: ${verifyData.length} work sessions found`);
    
    // Display some statistics
    const completedSessions = verifyData.filter(session => session.status === 'completed');
    const activeSessions = verifyData.filter(session => session.status === 'working' || session.status === 'break');
    
    console.log('\n📊 Migration Statistics:');
    console.log(`   Total sessions: ${verifyData.length}`);
    console.log(`   Completed sessions: ${completedSessions.length}`);
    console.log(`   Active sessions: ${activeSessions.length}`);
    
    // Show sample data
    console.log('\n📋 Sample work session data:');
    if (verifyData.length > 0) {
      const sample = verifyData[0];
      console.log(`   Employee: ${sample.employee_name}`);
      console.log(`   Start time: ${sample.start_time}`);
      console.log(`   Status: ${sample.status}`);
      console.log(`   Vehicle: ${sample.vehicle_name} (${sample.vehicle_plate})`);
      if (sample.total_hours) {
        console.log(`   Total hours: ${sample.total_hours}`);
      }
    }
    
    console.log('\n🎉 Work sessions migration completed successfully!');
    console.log('💡 Next steps:');
    console.log('   1. Update the app to use workSessionService instead of local state');
    console.log('   2. Test work session operations (start, end, breaks, etc.)');
    console.log('   3. Continue with files and materials migration');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
migrateWorkSessions(); 