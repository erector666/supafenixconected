import { supabase } from '../supabase-config'

export class UserService {
  // Create a new employee
  static async createEmployee(employeeData) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([{
          name: employeeData.name,
          email: employeeData.email,
          role: employeeData.role,
          phone: employeeData.phone,
          department: employeeData.department,
          hire_date: employeeData.hireDate,
          status: 'active'
        }])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Create employee error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get all employees
  static async getAllEmployees(filters = {}) {
    try {
      let query = supabase
        .from('employees')
        .select('*')
        .order('name')

      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.role) {
        query = query.eq('role', filters.role)
      }
      if (filters.department) {
        query = query.eq('department', filters.department)
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get all employees error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get employee by ID
  static async getEmployeeById(employeeId) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get employee by ID error:', error)
      return { success: false, error: error.message }
    }
  }

  // Update employee
  static async updateEmployee(employeeId, updates) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', employeeId)
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Update employee error:', error)
      return { success: false, error: error.message }
    }
  }

  // Delete employee
  static async deleteEmployee(employeeId) {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete employee error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get employee statistics
  static async getEmployeeStats() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('status, role, department')
      
      if (error) throw error

      const stats = {
        total: data.length,
        active: data.filter(emp => emp.status === 'active').length,
        inactive: data.filter(emp => emp.status === 'inactive').length,
        byRole: {},
        byDepartment: {}
      }

      // Count by role
      data.forEach(emp => {
        stats.byRole[emp.role] = (stats.byRole[emp.role] || 0) + 1
      })

      // Count by department
      data.forEach(emp => {
        stats.byDepartment[emp.department] = (stats.byDepartment[emp.department] || 0) + 1
      })

      return { success: true, data: stats }
    } catch (error) {
      console.error('Get employee stats error:', error)
      return { success: false, error: error.message }
    }
  }

  // Listen to employee changes
  static subscribeToEmployees(callback) {
    return supabase
      .channel('employees_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'employees' }, 
        callback
      )
      .subscribe()
  }
}

export default UserService 