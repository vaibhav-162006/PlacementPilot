-- PlacementPilot Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    college TEXT,
    graduation_year INTEGER,
    target_role TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    event_name TEXT NOT NULL,
    variation TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice sessions table
CREATE TABLE public.practice_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    variation TEXT NOT NULL,
    session_type TEXT NOT NULL,
    session_id TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT FALSE
);

-- Experiment assignments table
CREATE TABLE public.experiment_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    variation TEXT NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    flagsmith_flag_key TEXT DEFAULT 'placement_dashboard_experiment'
);

-- Indexes for better query performance
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_variation ON public.analytics_events(variation);
CREATE INDEX idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX idx_practice_sessions_user_id ON public.practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_variation ON public.practice_sessions(variation);
CREATE INDEX idx_experiment_assignments_variation ON public.experiment_assignments(variation);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_assignments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Analytics events policies
CREATE POLICY "Users can insert own events" ON public.analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own events" ON public.analytics_events
    FOR SELECT USING (auth.uid() = user_id);

-- Practice sessions policies
CREATE POLICY "Users can insert own sessions" ON public.practice_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON public.practice_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.practice_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Experiment assignments policies
CREATE POLICY "Users can view own assignment" ON public.experiment_assignments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assignment" ON public.experiment_assignments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to auto-assign experiment variation
CREATE OR REPLACE FUNCTION public.assign_experiment_variation()
RETURNS TRIGGER AS $$
DECLARE
    v_variation TEXT;
BEGIN
    -- 50/50 split based on user ID hash
    v_variation := CASE
        WHEN (hashtextextended(NEW.id::text, 0) % 2) = 0
        THEN 'daily_practice'
        ELSE 'personalized_roadmap'
    END;

    INSERT INTO public.experiment_assignments (user_id, variation)
    VALUES (NEW.id, v_variation)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for experiment assignment
DROP TRIGGER IF EXISTS on_user_experiment_assignment ON auth.users;
CREATE TRIGGER on_user_experiment_assignment
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.assign_experiment_variation();