-- Create user_emails table
CREATE TABLE IF NOT EXISTS user_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to insert emails
CREATE POLICY "Allow anonymous users to insert emails"
    ON user_emails
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy to allow authenticated users to read emails
CREATE POLICY "Allow authenticated users to read emails"
    ON user_emails
    FOR SELECT
    TO authenticated
    USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_emails_updated_at
    BEFORE UPDATE ON user_emails
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 