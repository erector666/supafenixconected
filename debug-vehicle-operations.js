// Debug script to test vehicle operations step by step
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Debugging Vehicle Operations...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugVehicleOperations() {
  try {
    console.log('1️⃣ Current vehicles in database:');
    const { data: currentVehicles, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .order('name');
    
    if (fetchError) {
      console.error('❌ Error fetching vehicles:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${currentVehicles.length} vehicles:`);
    currentVehicles.forEach(v => {
      console.log(`   - ${v.name} (${v.license_plate}) - ID: ${v.id}`);
    });

    console.log('\n2️⃣ Testing vehicle creation with detailed logging...');
    const testVehicle = {
      name: 'Debug Test Vehicle',
      license_plate: 'DEBUG-001',
      type: 'car',
      status: 'active'
    };
    
    console.log('📝 Attempting to create vehicle with data:', testVehicle);
    
    const { data: createdVehicle, error: createError } = await supabase
      .from('vehicles')
      .insert([testVehicle])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Error creating vehicle:', createError);
      console.error('Error details:', JSON.stringify(createError, null, 2));
      return;
    }
    
    console.log('✅ Vehicle created successfully:', createdVehicle);

    console.log('\n3️⃣ Verifying vehicle was added to database...');
    const { data: verifyVehicles, error: verifyError } = await supabase
      .from('vehicles')
      .select('*')
      .order('name');
    
    if (verifyError) {
      console.error('❌ Error verifying vehicles:', verifyError);
      return;
    }
    
    console.log(`📊 Now have ${verifyVehicles.length} vehicles:`);
    verifyVehicles.forEach(v => {
      console.log(`   - ${v.name} (${v.license_plate}) - ID: ${v.id}`);
    });

    console.log('\n4️⃣ Testing vehicle update...');
    const updateData = { name: 'Updated Debug Vehicle' };
    console.log('📝 Attempting to update vehicle with data:', updateData);
    
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
    
    console.log('✅ Vehicle updated successfully:', updatedVehicle);

    console.log('\n5️⃣ Testing vehicle deletion...');
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', createdVehicle.id);
    
    if (deleteError) {
      console.error('❌ Error deleting vehicle:', deleteError);
      return;
    }
    
    console.log('✅ Vehicle deleted successfully');

    console.log('\n6️⃣ Final verification...');
    const { data: finalVehicles, error: finalError } = await supabase
      .from('vehicles')
      .select('*')
      .order('name');
    
    if (finalError) {
      console.error('❌ Error fetching final vehicles:', finalError);
      return;
    }
    
    console.log(`📊 Final vehicle count: ${finalVehicles.length}`);
    
    console.log('\n🎉 All vehicle operations working correctly!');
    console.log('💡 If the frontend is not updating, the issue might be:');
    console.log('   - State management not refreshing after operations');
    console.log('   - Error handling not showing errors to user');
    console.log('   - Network issues preventing operations');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugVehicleOperations(); 