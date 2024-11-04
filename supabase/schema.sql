-- Create tables
CREATE TABLE IF NOT EXISTS public.pumping_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    session_type TEXT CHECK (session_type IN ('regular', 'power')),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    duration_minutes INTEGER,
    volume_ml DECIMAL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.dbf_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    end_time TIMESTAMP WITH TIME ZONE,
    breast_used TEXT CHECK (breast_used IN ('left', 'right', 'both')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.diaper_changes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    change_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    type TEXT CHECK (type IN ('wet', 'soiled', 'both')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security on tables
ALTER TABLE public.pumping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dbf_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diaper_changes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own pumping sessions"
    ON public.pumping_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pumping sessions"
    ON public.pumping_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own DBF sessions"
    ON public.dbf_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own DBF sessions"
    ON public.dbf_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own DBF sessions"
    ON public.dbf_sessions
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own diaper changes"
    ON public.diaper_changes
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diaper changes"
    ON public.diaper_changes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_pumping_sessions_updated_at
    BEFORE UPDATE ON public.pumping_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_dbf_sessions_updated_at
    BEFORE UPDATE ON public.dbf_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_diaper_changes_updated_at
    BEFORE UPDATE ON public.diaper_changes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
