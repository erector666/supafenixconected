import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database URL for direct PostgreSQL connections (if needed)
export const databaseUrl = import.meta.env.DATABASE_URL

// Service role key for admin operations (server-side only)
export const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY

export default supabase 