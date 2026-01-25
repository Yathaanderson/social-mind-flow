-- Create posts table for storing social media posts
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    platforms TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'agendado', 'publicado')),
    engagement_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for posts
CREATE POLICY "Users can view their own posts"
    ON public.posts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own posts"
    ON public.posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
    ON public.posts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
    ON public.posts FOR DELETE
    USING (auth.uid() = user_id);

-- Create user_settings table
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    notification_enabled BOOLEAN DEFAULT true,
    comment_notification_enabled BOOLEAN DEFAULT true,
    best_posting_time TEXT DEFAULT '10:00',
    notification_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_settings
CREATE POLICY "Users can view their own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON public.user_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Create social_accounts table
CREATE TABLE public.social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'twitter', 'tiktok')),
    username TEXT,
    is_connected BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, platform)
);

-- Enable RLS on social_accounts
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- RLS policies for social_accounts
CREATE POLICY "Users can view their own social accounts"
    ON public.social_accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own social accounts"
    ON public.social_accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts"
    ON public.social_accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social accounts"
    ON public.social_accounts FOR DELETE
    USING (auth.uid() = user_id);

-- Create profiles table for user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
    
    INSERT INTO public.user_settings (user_id, notification_email)
    VALUES (NEW.id, NEW.email);
    
    -- Create default social account entries
    INSERT INTO public.social_accounts (user_id, platform) VALUES
        (NEW.id, 'instagram'),
        (NEW.id, 'linkedin'),
        (NEW.id, 'twitter'),
        (NEW.id, 'tiktok');
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at
    BEFORE UPDATE ON public.social_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();