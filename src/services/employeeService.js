// Employee Service for Supabase
import { supabase } from '../supabase-config';

class EmployeeService {
  // Get all employees
  async getAllEmployees() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  }

  // Get active employees only
  async getActiveEmployees() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active employees:', error);
      return [];
    }
  }

  // Get workers only (excluding admin)
  async getWorkers() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('role', 'worker')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching workers:', error);
      return [];
    }
  }

  // Get employee by ID
  async getEmployeeById(id) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching employee by ID:', error);
      return null;
    }
  }

  // Get employee by email
  async getEmployeeByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching employee by email:', error);
      return null;
    }
  }

  // Validate login credentials
  async validateCredentials(email, password) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('status', 'active')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error validating credentials:', error);
      return null;
    }
  }

  // Create new employee
  async createEmployee(employeeData) {
    try {
      console.log('Creating employee with data:', employeeData);
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error creating employee:', error);
        throw error;
      }
      console.log('Employee created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  // Update employee
  async updateEmployee(id, updates) {
    try {
      console.log('Updating employee with ID:', id, 'and updates:', updates);
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error updating employee:', error);
        throw error;
      }
      console.log('Employee updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  // Delete employee
  async deleteEmployee(id) {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  // Soft delete employee (set status to inactive)
  async deactivateEmployee(id) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deactivating employee:', error);
      throw error;
    }
  }

  // Reactivate employee
  async reactivateEmployee(id) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error reactivating employee:', error);
      throw error;
    }
  }

  // Search employees
  async searchEmployees(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching employees:', error);
      return [];
    }
  }

  // Get employees by department
  async getEmployeesByDepartment(department) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('department', department)
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching employees by department:', error);
      return [];
    }
  }

  // Get employees by role
  async getEmployeesByRole(role) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('role', role)
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching employees by role:', error);
      return [];
    }
  }

  // Get employee statistics
  async getEmployeeStats() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('role, status');
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        active: data.filter(emp => emp.status === 'active').length,
        inactive: data.filter(emp => emp.status === 'inactive').length,
        admin: data.filter(emp => emp.role === 'admin' && emp.status === 'active').length,
        workers: data.filter(emp => emp.role === 'worker' && emp.status === 'active').length
      };
      
      return stats;
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        admin: 0,
        workers: 0
      };
    }
  }
}

export default new EmployeeService(); 