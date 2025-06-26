-- Create user_analysis table
CREATE TABLE IF NOT EXISTS user_analysis (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    birth_date DATE NOT NULL,
    birth_time TIME WITHOUT TIME ZONE NOT NULL,
    birth_location TEXT NOT NULL,
    elements JSONB NOT NULL,
    dominant_element TEXT NOT NULL,
    favorable_elements TEXT[] NOT NULL,
    lucky_colors TEXT[] NOT NULL,
    recommendations TEXT[] NOT NULL,
    encouragement TEXT NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_analysis_email ON user_analysis(email);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_user_analysis_created_at ON user_analysis(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_analysis ENABLE ROW LEVEL SECURITY;

-- Allow insert for all users (since this is a public form)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analysis' AND policyname = 'Allow insert for all users') THEN
        CREATE POLICY "Allow insert for all users" ON user_analysis
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Allow select for all users (for admin purposes)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analysis' AND policyname = 'Allow select for all users') THEN
        CREATE POLICY "Allow select for all users" ON user_analysis
            FOR SELECT USING (true);
    END IF;
END $$;

-- Allow update for all users (in case user wants to update their info)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analysis' AND policyname = 'Allow update for all users') THEN
        CREATE POLICY "Allow update for all users" ON user_analysis
            FOR UPDATE USING (true);
    END IF;
END $$;

-- Allow delete for all users (in case user wants to delete their data)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analysis' AND policyname = 'Allow delete for all users') THEN
        CREATE POLICY "Allow delete for all users" ON user_analysis
            FOR DELETE USING (true);
    END IF;
END $$; 