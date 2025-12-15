-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'employer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Worker profiles
CREATE TABLE public.worker_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  headline TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate_min DECIMAL(10,2) NOT NULL DEFAULT 1.00,
  hourly_rate_max DECIMAL(10,2) NOT NULL DEFAULT 3.00,
  availability_hours INTEGER NOT NULL DEFAULT 8,
  availability_type TEXT NOT NULL DEFAULT 'full-time' CHECK (availability_type IN ('part-time', 'full-time')),
  bio TEXT NOT NULL DEFAULT '',
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  review_count INTEGER NOT NULL DEFAULT 0,
  average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Employer profiles
CREATE TABLE public.employer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  avatar_url TEXT,
  country TEXT NOT NULL DEFAULT '',
  country_code TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Jobs
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate_min DECIMAL(10,2) NOT NULL DEFAULT 1.00,
  hourly_rate_max DECIMAL(10,2) NOT NULL DEFAULT 3.00,
  availability_hours INTEGER NOT NULL DEFAULT 8,
  country_preference TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(worker_id, employer_id)
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Saved workers (for employers)
CREATE TABLE public.saved_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employer_id, worker_id)
);

-- Create indexes for better performance
CREATE INDEX idx_worker_profiles_user_id ON public.worker_profiles(user_id);
CREATE INDEX idx_worker_profiles_country_code ON public.worker_profiles(country_code);
CREATE INDEX idx_worker_profiles_skills ON public.worker_profiles USING GIN(skills);
CREATE INDEX idx_worker_profiles_last_active ON public.worker_profiles(last_active DESC);
CREATE INDEX idx_employer_profiles_user_id ON public.employer_profiles(user_id);
CREATE INDEX idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX idx_jobs_skills ON public.jobs USING GIN(skills);
CREATE INDEX idx_reviews_worker_id ON public.reviews(worker_id);
CREATE INDEX idx_reviews_employer_id ON public.reviews(employer_id);
CREATE INDEX idx_conversations_worker_id ON public.conversations(worker_id);
CREATE INDEX idx_conversations_employer_id ON public.conversations(employer_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_saved_workers_employer_id ON public.saved_workers(employer_id);
CREATE INDEX idx_saved_workers_worker_id ON public.saved_workers(worker_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_workers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert their profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for worker_profiles
CREATE POLICY "Anyone can view worker profiles" ON public.worker_profiles
  FOR SELECT USING (true);

CREATE POLICY "Workers can update their own profile" ON public.worker_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Workers can insert their own profile" ON public.worker_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for employer_profiles
CREATE POLICY "Anyone can view employer profiles" ON public.employer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Employers can update their own profile" ON public.employer_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Employers can insert their own profile" ON public.employer_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs" ON public.jobs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Employers can view their own jobs" ON public.jobs
  FOR SELECT USING (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Employers can create jobs" ON public.jobs
  FOR INSERT WITH CHECK (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Employers can update their own jobs" ON public.jobs
  FOR UPDATE USING (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Employers can delete their own jobs" ON public.jobs
  FOR DELETE USING (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Employers can create reviews for workers" ON public.reviews
  FOR INSERT WITH CHECK (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) OR
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) OR
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own conversations" ON public.conversations
  FOR UPDATE USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) OR
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE
        worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) OR
        employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create messages in their conversations" ON public.messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE
        worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) OR
        employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    ) AND sender_id = auth.uid()
  );

CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());

-- RLS Policies for saved_workers
CREATE POLICY "Employers can view their saved workers" ON public.saved_workers
  FOR SELECT USING (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Employers can save workers" ON public.saved_workers
  FOR INSERT WITH CHECK (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Employers can unsave workers" ON public.saved_workers
  FOR DELETE USING (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.worker_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.employer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update review stats on worker profile
CREATE OR REPLACE FUNCTION public.update_worker_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.worker_profiles
  SET 
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE worker_id = NEW.worker_id),
    average_rating = (SELECT AVG(rating) FROM public.reviews WHERE worker_id = NEW.worker_id)
  WHERE id = NEW.worker_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_review_stats AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_worker_review_stats();

-- Function to update conversation on new message
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message = NEW.content,
    last_message_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_on_message();
