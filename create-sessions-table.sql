-- Create sessions table for Remember Me functionality
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  remember_me BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_employee_id ON sessions(employee_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_remember_me ON sessions(remember_me);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sessions
-- Allow users to manage their own sessions
CREATE POLICY "Users can manage their own sessions" ON sessions
  FOR ALL USING (auth.uid()::text = employee_id::text);

-- Allow service role to manage all sessions (for admin functions)
CREATE POLICY "Service role can manage all sessions" ON sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Create a function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired sessions (optional)
-- This would require pg_cron extension to be enabled
-- SELECT cron.schedule('cleanup-expired-sessions', '0 2 * * *', 'SELECT cleanup_expired_sessions();');

-- Insert some test data (optional - remove in production)
-- INSERT INTO sessions (employee_id, remember_me, expires_at) VALUES 
--   ('your-employee-id-here', true, NOW() + INTERVAL '30 days');

COMMENT ON TABLE sessions IS 'User sessions for Remember Me functionality';
COMMENT ON COLUMN sessions.employee_id IS 'Reference to the employee who owns this session';
COMMENT ON COLUMN sessions.remember_me IS 'Whether this session should persist across browser restarts';
COMMENT ON COLUMN sessions.expires_at IS 'When this session expires';
COMMENT ON COLUMN sessions.created_at IS 'When this session was created';
COMMENT ON COLUMN sessions.last_activity IS 'Last time this session was used'; 