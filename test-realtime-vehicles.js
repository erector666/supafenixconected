// Test script to verify real-time vehicle updates
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Real-time Vehicle Updates...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealTimeVehicles() {
  try {
    console.log('1️⃣ Setting up real-time subscription...');
    
    // Subscribe to vehicle changes
    const subscription = supabase
      .channel('test_vehicles_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'vehicles' 
        }, 
        (payload) => {
          console.log('🔄 Real-time event received:', payload.eventType);
          console.log('📝 Payload:', JSON.stringify(payload, null, 2));
          
          if (payload.eventType === 'INSERT') {
            console.log('✅ New vehicle detected:', payload.new.name);
          } else if (payload.eventType === 'UPDATE') {
            console.log('✅ Vehicle update detected:', payload.new.name);
          } else if (payload.eventType === 'DELETE') {
            console.log('✅ Vehicle deletion detected:', payload.old.name);
          }
        }
      )
      .subscribe();

    console.log('✅ Real-time subscription active');

    // Wait a moment for subscription to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n2️⃣ Testing vehicle creation (should trigger INSERT event)...');
    const testVehicle = {
      name: 'Real-time Test Vehicle',
      license_plate: 'RT-001',
      type: 'car',
      status: 'active'
    };
    
    const { data: createdVehicle, error: createError } = await supabase
      .from('vehicles')
      .insert([testVehicle])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Error creating test vehicle:', createError);
      return;
    }
    
    console.log('✅ Test vehicle created:', createdVehicle.name);

    // Wait for real-time event
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n3️⃣ Testing vehicle update (should trigger UPDATE event)...');
    const updateData = { name: 'Updated Real-time Test Vehicle' };
    
    const { data: updatedVehicle, error: updateError } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', createdVehicle.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Error updating test vehicle:', updateError);
      return;
    }
    
    console.log('✅ Test vehicle updated:', updatedVehicle.name);

    // Wait for real-time event
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n4️⃣ Testing vehicle deletion (should trigger DELETE event)...');
    
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', createdVehicle.id);
    
    if (deleteError) {
      console.error('❌ Error deleting test vehicle:', deleteError);
      return;
    }
    
    console.log('✅ Test vehicle deleted');

    // Wait for real-time event
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n5️⃣ Cleaning up subscription...');
    supabase.removeChannel('test_vehicles_changes');
    
    console.log('\n🎉 Real-time vehicle test completed!');
    console.log('💡 Check the console logs above to see real-time events');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testRealTimeVehicles(); 