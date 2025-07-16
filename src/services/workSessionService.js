import { supabase } from '../supabase-config';

class WorkSessionService {
  // Get all work sessions
  async getAllWorkSessions() {
    try {
      const { data, error } = await supabase
        .from('work_sessions')
        .select('*')
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching work sessions:', error);
      throw error;
    }
  }

  // Get work sessions by employee
  async getWorkSessionsByEmployee(employeeId) {
    try {
      const { data, error } = await supabase
        .from('work_sessions')
        .select('*')
        .eq('employee_id', employeeId)
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching work sessions by employee:', error);
      throw error;
    }
  }

  // Get active work session for employee
  async getActiveWorkSession(employeeId) {
    try {
      const { data, error } = await supabase
        .from('work_sessions')
        .select('*')
        .eq('employee_id', employeeId)
        .in('status', ['working', 'break'])
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data || null;
    } catch (error) {
      console.error('Error fetching active work session:', error);
      throw error;
    }
  }

  // Create new work session
  async createWorkSession(sessionData) {
    try {
      const { data, error } = await supabase
        .from('work_sessions')
        .insert([{
          employee_id: sessionData.employeeId,
          employee_name: sessionData.employeeName,
          start_time: sessionData.startTime,
          start_location: sessionData.startLocation,
          vehicle_id: sessionData.vehicle?.id,
          vehicle_name: sessionData.vehicle?.name,
          vehicle_plate: sessionData.vehicle?.license_plate,
          gas_amount: sessionData.gasAmount || 0,
          work_description: sessionData.workDescription,
          status: sessionData.status || 'working',
          location_history: sessionData.locationHistory || []
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating work session:', error);
      throw error;
    }
  }

  // Update work session
  async updateWorkSession(sessionId, updates) {
    try {
      const { data, error } = await supabase
        .from('work_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating work session:', error);
      throw error;
    }
  }

  // End work session
  async endWorkSession(sessionId, endData) {
    try {
      const { data, error } = await supabase
        .from('work_sessions')
        .update({
          end_time: endData.endTime,
          end_location: endData.endLocation,
          status: 'completed',
          total_hours: endData.totalHours,
          final_work_description: endData.finalWorkDescription
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error ending work session:', error);
      throw error;
    }
  }

  // Add break to work session
  async addBreak(sessionId, breakData) {
    try {
      const { data: currentSession, error: fetchError } = await supabase
        .from('work_sessions')
        .select('breaks')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;

      const updatedBreaks = [...(currentSession.breaks || []), breakData];

      const { data, error } = await supabase
        .from('work_sessions')
        .update({
          breaks: updatedBreaks,
          status: 'break'
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding break:', error);
      throw error;
    }
  }

  // Resume work session
  async resumeWork(sessionId) {
    try {
      const { data: currentSession, error: fetchError } = await supabase
        .from('work_sessions')
        .select('breaks')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;

      const updatedBreaks = currentSession.breaks || [];
      if (updatedBreaks.length > 0) {
        updatedBreaks[updatedBreaks.length - 1].end = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('work_sessions')
        .update({
          breaks: updatedBreaks,
          status: 'working'
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error resuming work:', error);
      throw error;
    }
  }

  // Add screenshot to work session
  async addScreenshot(sessionId, screenshotData) {
    try {
      const { data: currentSession, error: fetchError } = await supabase
        .from('work_sessions')
        .select('screenshots')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;

      const updatedScreenshots = [...(currentSession.screenshots || []), screenshotData];

      const { data, error } = await supabase
        .from('work_sessions')
        .update({ screenshots: updatedScreenshots })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding screenshot:', error);
      throw error;
    }
  }

  // Update location history
  async updateLocationHistory(sessionId, locationData) {
    try {
      const { data: currentSession, error: fetchError } = await supabase
        .from('work_sessions')
        .select('location_history')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;

      const updatedLocationHistory = [...(currentSession.location_history || []), locationData];

      const { data, error } = await supabase
        .from('work_sessions')
        .update({ location_history: updatedLocationHistory })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating location history:', error);
      throw error;
    }
  }

  // Delete work session
  async deleteWorkSession(sessionId) {
    try {
      const { error } = await supabase
        .from('work_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting work session:', error);
      throw error;
    }
  }

  // Get work sessions by date range
  async getWorkSessionsByDateRange(startDate, endDate, employeeId = null) {
    try {
      let query = supabase
        .from('work_sessions')
        .select('*')
        .gte('start_time', startDate)
        .lte('start_time', endDate)
        .order('start_time', { ascending: false });

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching work sessions by date range:', error);
      throw error;
    }
  }

  // Get work statistics
  async getWorkStatistics(employeeId = null, dateRange = null) {
    try {
      let query = supabase
        .from('work_sessions')
        .select('*');

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      if (dateRange) {
        query = query.gte('start_time', dateRange.start)
                   .lte('start_time', dateRange.end);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stats = {
        totalSessions: data.length,
        totalHours: 0,
        completedSessions: 0,
        activeSessions: 0
      };

      data.forEach(session => {
        if (session.status === 'completed' && session.total_hours) {
          stats.totalHours += session.total_hours;
          stats.completedSessions++;
        } else if (session.status === 'working' || session.status === 'break') {
          stats.activeSessions++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching work statistics:', error);
      throw error;
    }
  }
}

export default new WorkSessionService(); 