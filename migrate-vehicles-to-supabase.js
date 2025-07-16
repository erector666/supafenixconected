// Migration script to move vehicles from local array to Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lykhurrywtvzffbcbkdp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2h1cnJ5d3R2emZmYmNia2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTgxODA3NCwiZXhwIjoyMDY3Mzk0MDc0fQ.TS9lkYBcA1e6mcK1_6JL8-Qbt-hXuhedovWTZBVtDPk';
const supabase = createClient(supabaseUrl, supabaseKey);

const vehicles = [
  { name: 'Van #1', type: 'Van', license_plate: 'ABC-123', status: 'active' },
  { name: 'Van #2', type: 'Van', license_plate: 'DEF-456', status: 'active' },
  { name: 'Truck #1', type: 'Truck', license_plate: 'GHI-789', status: 'active' },
  { name: 'Worker Van', type: 'Van', license_plate: 'XYZ-999', status: 'active' },
  { name: 'Personal Car', type: 'Car', license_plate: 'Own Vehicle', status: 'active' }
];

async function migrateVehicles() {
  console.log('🚚 Starting vehicle migration to Supabase...');
  try {
    // Clear all existing vehicles (using a WHERE clause that matches all rows)
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .gt('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
      console.error('❌ Error clearing existing vehicles:', deleteError);
      return;
    }
    // Insert new vehicle data
    for (const vehicle of vehicles) {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicle])
        .select();
      if (error) {
        console.error(`❌ Error inserting ${vehicle.name}:`, error);
      } else {
        console.log(`✅ Successfully inserted ${vehicle.name}`);
      }
    }
    // Verify the migration
    const { data: finalVehicles, error: verifyError } = await supabase
      .from('vehicles')
      .select('*')
      .order('name');
    if (verifyError) {
      console.error('❌ Error verifying migration:', verifyError);
      return;
    }
    console.log('\n🎉 Vehicle migration completed!');
    console.log(`📊 Total vehicles in database: ${finalVehicles.length}`);
    finalVehicles.forEach(v => {
      console.log(`  - ${v.name} (${v.license_plate})`);
    });
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrateVehicles(); 