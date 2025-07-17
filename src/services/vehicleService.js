// Vehicle Service for Supabase
import { supabase } from '../supabase-config';

class VehicleService {
  // Get all vehicles
  async getAllVehicles() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return [];
    }
  }

  // Get active vehicles only
  async getActiveVehicles() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active vehicles:', error);
      return [];
    }
  }

  // Get vehicle by ID
  async getVehicleById(id) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching vehicle by ID:', error);
      return null;
    }
  }

  // Create new vehicle
  async createVehicle(vehicleData) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  }

  // Update vehicle
  async updateVehicle(id, updates) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  }

  // Delete vehicle
  async deleteVehicle(id) {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }

  // Soft delete vehicle (set status to inactive)
  async deactivateVehicle(id) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deactivating vehicle:', error);
      throw error;
    }
  }

  // Reactivate vehicle
  async reactivateVehicle(id) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error reactivating vehicle:', error);
      throw error;
    }
  }

  // Search vehicles
  async searchVehicles(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,license_plate.ilike.%${searchTerm}%`)
        .order('name');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching vehicles:', error);
      return [];
    }
  }

  // Subscribe to real-time vehicle changes
  subscribeToVehicles(callback) {
    const channel = supabase
      .channel('vehicles_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'vehicles' 
        }, 
        (payload) => {
          console.log('🔄 Real-time vehicle change detected:', payload);
          callback(payload);
        }
      )
      .subscribe();
    
    return channel;
  }

  // Unsubscribe from real-time vehicle changes
  unsubscribeFromVehicles() {
    try {
      supabase.removeChannel('vehicles_changes');
    } catch (error) {
      console.log('🧹 Vehicle subscription cleanup completed');
    }
  }
}

export default new VehicleService(); 