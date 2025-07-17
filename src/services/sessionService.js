// Session Service for Remember Me functionality
import { supabase } from '../supabase-config';

class SessionService {
  // Create a new session for remember me
  async createSession(employeeId, rememberMe = false) {
    try {
      // Generate a unique token
      const token = 'fenix_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const sessionData = {
        employee_id: employeeId,
        token: token,
        is_remember_me: rememberMe,
        expires_at: rememberMe 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        created_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString()
      };

      console.log('🔐 Creating session with data:', sessionData);

      const { data, error } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      // Store session token in localStorage if remember me is enabled
      if (rememberMe) {
        localStorage.setItem('fenix_session_token', data.token);
        localStorage.setItem('fenix_remember_me', 'true');
      } else {
        sessionStorage.setItem('fenix_session_token', data.token);
      }

      console.log('✅ Session created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating session:', error);
      throw error;
    }
  }

  // Get session by token
  async getSession(sessionToken) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          employees (
            id,
            name,
            email,
            role,
            status
          )
        `)
        .eq('token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) throw error;

      if (data) {
        // Update last activity
        await this.updateSessionActivity(sessionToken);
        return data;
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting session:', error);
      return null;
    }
  }

  // Update session last activity
  async updateSessionActivity(sessionToken) {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('token', sessionToken);

      if (error) throw error;
    } catch (error) {
      console.error('❌ Error updating session activity:', error);
    }
  }

  // Delete session (logout)
  async deleteSession(sessionToken) {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('token', sessionToken);

      if (error) throw error;

      // Clear storage
      localStorage.removeItem('fenix_session_token');
      localStorage.removeItem('fenix_remember_me');
      sessionStorage.removeItem('fenix_session_token');

      console.log('✅ Session deleted');
      return true;
    } catch (error) {
      console.error('❌ Error deleting session:', error);
      throw error;
    }
  }

  // Get current session token from storage
  getCurrentSessionToken() {
    // Check localStorage first (remember me)
    const rememberMeToken = localStorage.getItem('fenix_session_token');
    if (rememberMeToken) {
      return rememberMeToken;
    }

    // Check sessionStorage (temporary session)
    const sessionToken = sessionStorage.getItem('fenix_session_token');
    if (sessionToken) {
      return sessionToken;
    }

    return null;
  }

  // Check if remember me is enabled
  isRememberMeEnabled() {
    return localStorage.getItem('fenix_remember_me') === 'true';
  }

  // Auto-login using stored session
  async autoLogin() {
    try {
      const sessionToken = this.getCurrentSessionToken();
      
      if (!sessionToken) {
        console.log('No session token found');
        return null;
      }

      console.log('🔄 Attempting auto-login with session token:', sessionToken);
      
      const session = await this.getSession(sessionToken);
      
      if (session && session.employees && session.employees.status === 'active') {
        console.log('✅ Auto-login successful:', session.employees.name);
        return session.employees;
      } else {
        console.log('❌ Auto-login failed - invalid or expired session');
        // Clear invalid session
        this.clearStoredSession();
        return null;
      }
    } catch (error) {
      console.error('❌ Auto-login error:', error);
      this.clearStoredSession();
      return null;
    }
  }

  // Clear stored session data
  clearStoredSession() {
    localStorage.removeItem('fenix_session_token');
    localStorage.removeItem('fenix_remember_me');
    sessionStorage.removeItem('fenix_session_token');
  }

  // Clean up expired sessions (admin function)
  async cleanupExpiredSessions() {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) throw error;
      
      console.log('✅ Expired sessions cleaned up');
      return true;
    } catch (error) {
      console.error('❌ Error cleaning up expired sessions:', error);
      throw error;
    }
  }

  // Get all active sessions (admin function)
  async getActiveSessions() {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          employees (
            id,
            name,
            email,
            role
          )
        `)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error getting active sessions:', error);
      return [];
    }
  }
}

export default new SessionService(); 