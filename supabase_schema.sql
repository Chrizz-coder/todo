-- ============================================================
--  SUPABASE DATABASE SETUP — Run this in the Supabase SQL Editor
--  Go to: supabase.com → your project → SQL Editor → New Query
-- ============================================================

-- 1. Create the "todos" table
CREATE TABLE IF NOT EXISTS public.todos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(), -- Auto UUID
  text        TEXT        NOT NULL CHECK (char_length(text) > 0),
  completed   BOOLEAN     NOT NULL DEFAULT false,
  priority    TEXT        NOT NULL DEFAULT 'medium'
                          CHECK (priority IN ('low', 'medium', 'high')),
  created_at  TIMESTAMPTZ NOT NULL Dprject EFAULT now(),
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE -- For auth (optional)
);

-- 2. Enable Row Level Security (RLS)
-- This ensures users can only see their own data when auth is enabled.
-- For now (no auth), we'llprject  allow all anonymous reads/writes.
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policy: allow anyone (anon key) to do everything
-- ⚠️  In production, replace this with user-specific policies!
CREATE POLICY "Allow all access for now"
  ON public.todos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Enable Realtime for the todos table
-- This is what makes useTodos() receive live updates!
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;

-- 5. (Optional) seed some example todos
INSERT INTO public.todos (text, priority) VALUES
  ('Read about React hooks', 'high'),
  ('Set up Supabase project', 'high'),
  ('Build the Todo UI', 'medium'),
  ('Deploy to Vercel or Netlify', 'low');
