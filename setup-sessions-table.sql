-- Create sessions table for "Remember Me" functionality
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_remember_me BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_employee_id ON sessions(employee_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow employees to view their own sessions
CREATE POLICY "Employees can view own sessions" ON sessions
    FOR SELECT USING (auth.uid()::text = employee_id::text);

-- Allow employees to insert their own sessions
CREATE POLICY "Employees can create own sessions" ON sessions
    FOR INSERT WITH CHECK (auth.uid()::text = employee_id::text);

-- Allow employees to update their own sessions
CREATE POLICY "Employees can update own sessions" ON sessions
    FOR UPDATE USING (auth.uid()::text = employee_id::text);

-- Allow employees to delete their own sessions
CREATE POLICY "Employees can delete own sessions" ON sessions
    FOR DELETE USING (auth.uid()::text = employee_id::text);

-- Allow service role to manage all sessions (for cleanup)
CREATE POLICY "Service role can manage all sessions" ON sessions
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END;
$$;

-- Create a scheduled job to clean up expired sessions (runs every hour)
SELECT cron.schedule(
    'cleanup-expired-sessions',
    '0 * * * *', -- Every hour
    'SELECT cleanup_expired_sessions();'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON sessions TO anon, authenticated;
GRANT ALL ON sessions TO service_role;

-- Create function to get valid session by token
CREATE OR REPLACE FUNCTION get_session_by_token(session_token TEXT)
RETURNS TABLE (
    id UUID,
    employee_id UUID,
    token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    is_remember_me BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update last accessed timestamp
    UPDATE sessions 
    SET last_accessed_at = NOW() 
    WHERE token = session_token AND expires_at > NOW();
    
    -- Return session data
    RETURN QUERY
    SELECT s.id, s.employee_id, s.token, s.expires_at, s.created_at, s.last_accessed_at, s.is_remember_me
    FROM sessions s
    WHERE s.token = session_token AND s.expires_at > NOW();
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_session_by_token(TEXT) TO anon, authenticated, service_role; 