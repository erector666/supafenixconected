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

async function checkVehicleSchema() {
  console.log('🔍 Checking Vehicles Table Schema...\n');

  try {
    // Get all vehicles to see the structure
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error fetching vehicles:', error);
      return;
    }

    if (vehicles && vehicles.length > 0) {
      console.log('📋 Current vehicle structure:');
      const vehicle = vehicles[0];
      Object.keys(vehicle).forEach(key => {
        console.log(`   - ${key}: ${typeof vehicle[key]} (${vehicle[key]})`);
      });
    } else {
      console.log('📋 No vehicles found in table');
    }

    // Try to get table schema information
    console.log('\n🔍 Testing vehicle operations...');
    
    // Test creating a vehicle with different field names
    const testVehicle1 = {
      name: 'Test Vehicle 1',
      plate: 'TEST123'
    };

    console.log('Testing with "plate" field:', testVehicle1);
    const { data: created1, error: error1 } = await supabase
      .from('vehicles')
      .insert([testVehicle1])
      .select()
      .single();

    if (error1) {
      console.log('❌ Error with "plate" field:', error1.message);
    } else {
      console.log('✅ Success with "plate" field:', created1);
      // Clean up
      await supabase.from('vehicles').delete().eq('id', created1.id);
    }

    // Test with "license_plate" field
    const testVehicle2 = {
      name: 'Test Vehicle 2',
      license_plate: 'TEST456'
    };

    console.log('\nTesting with "license_plate" field:', testVehicle2);
    const { data: created2, error: error2 } = await supabase
      .from('vehicles')
      .insert([testVehicle2])
      .select()
      .single();

    if (error2) {
      console.log('❌ Error with "license_plate" field:', error2.message);
    } else {
      console.log('✅ Success with "license_plate" field:', created2);
      // Clean up
      await supabase.from('vehicles').delete().eq('id', created2.id);
    }

    // Test with "registration" field
    const testVehicle3 = {
      name: 'Test Vehicle 3',
      registration: 'TEST789'
    };

    console.log('\nTesting with "registration" field:', testVehicle3);
    const { data: created3, error: error3 } = await supabase
      .from('vehicles')
      .insert([testVehicle3])
      .select()
      .single();

    if (error3) {
      console.log('❌ Error with "registration" field:', error3.message);
    } else {
      console.log('✅ Success with "registration" field:', created3);
      // Clean up
      await supabase.from('vehicles').delete().eq('id', created3.id);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkVehicleSchema(); 