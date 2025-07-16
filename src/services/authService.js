import { supabase } from '../supabase-config'

export class AuthService {
  // Sign up with email and password
  static async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }
  }

  // Sign in with email and password
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { success: true, user }
    } catch (error) {
      console.error('Get current user error:', error)
      return { success: false, error: error.message }
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // Reset password
  static async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Reset password error:', error)
      return { success: false, error: error.message }
    }
  }

  // Update user profile
  static async updateProfile(updates) {
    try {
      const { data, error } = await supabase.auth.updateUser(updates)
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message }
    }
  }
}

export default AuthService 