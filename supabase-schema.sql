-- Supabase Database Schema for Markit Bookmarks App

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON public.bookmarks(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
    ON public.bookmarks
    FOR SELECT
    USING (user_id = current_setting('app.user_id', TRUE));

-- Create policy to allow users to insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
    ON public.bookmarks
    FOR INSERT
    WITH CHECK (user_id = current_setting('app.user_id', TRUE));

-- Create policy to allow users to update their own bookmarks
CREATE POLICY "Users can update their own bookmarks"
    ON public.bookmarks
    FOR UPDATE
    USING (user_id = current_setting('app.user_id', TRUE))
    WITH CHECK (user_id = current_setting('app.user_id', TRUE));

-- Create policy to allow users to delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
    ON public.bookmarks
    FOR DELETE
    USING (user_id = current_setting('app.user_id', TRUE));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookmarks_updated_at
    BEFORE UPDATE ON public.bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO anon;
