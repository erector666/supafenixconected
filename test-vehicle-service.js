// Test script to verify vehicle service functionality
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Vehicle Service with Supabase...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testVehicleService() {
  try {
    console.log('1️⃣ Testing vehicle table access...');
    const { data: vehicles, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .order('name');
    
    if (fetchError) {
      console.error('❌ Error fetching vehicles:', fetchError);
      return;
    }
    
    console.log(`✅ Found ${vehicles.length} vehicles in database`);
    vehicles.forEach(v => {
      console.log(`   - ${v.name} (${v.license_plate}) - ${v.status}`);
    });

    console.log('\n2️⃣ Testing vehicle creation...');
    const testVehicle = {
      name: 'Test Vehicle',
      license_plate: 'TEST-001',
      type: 'car',
      status: 'active'
    };
    
    const { data: createdVehicle, error: createError } = await supabase
      .from('vehicles')
      .insert([testVehicle])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Error creating vehicle:', createError);
      return;
    }
    
    console.log('✅ Vehicle created successfully:', createdVehicle.name);

    console.log('\n3️⃣ Testing vehicle update...');
    const updateData = { name: 'Updated Test Vehicle' };
    const { data: updatedVehicle, error: updateError } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', createdVehicle.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Error updating vehicle:', updateError);
      return;
    }
    
    console.log('✅ Vehicle updated successfully:', updatedVehicle.name);

    console.log('\n4️⃣ Testing vehicle deletion...');
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', createdVehicle.id);
    
    if (deleteError) {
      console.error('❌ Error deleting vehicle:', deleteError);
      return;
    }
    
    console.log('✅ Vehicle deleted successfully');

    console.log('\n5️⃣ Verifying final state...');
    const { data: finalVehicles, error: finalError } = await supabase
      .from('vehicles')
      .select('*')
      .order('name');
    
    if (finalError) {
      console.error('❌ Error fetching final vehicles:', finalError);
      return;
    }
    
    console.log(`✅ Final vehicle count: ${finalVehicles.length}`);
    
    console.log('\n🎉 All vehicle service tests passed!');
    console.log('🌐 The vehicle service should work correctly in the application.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testVehicleService(); 