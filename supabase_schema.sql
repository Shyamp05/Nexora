-- ========================================================
-- Nexora AI — Supabase Database Schema
-- Paste this script into the Supabase SQL Editor to set up tables.
-- ========================================================

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text default 'student',
  level integer default 1,
  xp integer default 0,
  streak integer default 0,
  preferred_language text default 'en',
  onboarding_completed boolean default false,
  study_goal_minutes integer default 60,
  subjects text[] default '{}',
  student_type text default 'school',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Trigger to automatically create a profile after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, onboarding_completed, level, xp, streak)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    false,
    1,
    0,
    0
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. CONVERSATIONS TABLE (AI Tutor Chats)
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  mode text default 'college' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for conversations
alter table public.conversations enable row level security;

-- RLS policies for conversations
create policy "Users can view their own conversations" on public.conversations
  for select using (auth.uid() = user_id);

create policy "Users can insert their own conversations" on public.conversations
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own conversations" on public.conversations
  for update using (auth.uid() = user_id);

create policy "Users can delete their own conversations" on public.conversations
  for delete using (auth.uid() = user_id);


-- 3. MESSAGES TABLE (AI Tutor Messages)
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for messages
alter table public.messages enable row level security;

-- RLS policies for messages
create policy "Users can view messages from their conversations" on public.messages
  for select using (
    exists (
      select 1 from public.conversations
      where public.conversations.id = public.messages.conversation_id
      and public.conversations.user_id = auth.uid()
    )
  );

create policy "Users can insert messages to their conversations" on public.messages
  for insert with check (
    exists (
      select 1 from public.conversations
      where public.conversations.id = public.messages.conversation_id
      and public.conversations.user_id = auth.uid()
    )
  );


-- 4. TASKS TABLE (Productivity Planner)
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  priority text default 'medium' not null check (priority in ('low', 'medium', 'high')),
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for tasks
alter table public.tasks enable row level security;

-- RLS policies for tasks
create policy "Users can view their own tasks" on public.tasks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own tasks" on public.tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks" on public.tasks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks" on public.tasks
  for delete using (auth.uid() = user_id);


-- 5. ROADMAPS TABLE (AI generated roadmaps)
create table public.roadmaps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  topic text not null,
  days integer not null,
  data jsonb not null, -- Stores the generated roadmap steps/JSON
  progress jsonb default '[]'::jsonb not null, -- Stores tracking checkmarks
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for roadmaps
alter table public.roadmaps enable row level security;

-- RLS policies for roadmaps
create policy "Users can view their own roadmaps" on public.roadmaps
  for select using (auth.uid() = user_id);

create policy "Users can insert their own roadmaps" on public.roadmaps
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own roadmaps" on public.roadmaps
  for update using (auth.uid() = user_id);

create policy "Users can delete their own roadmaps" on public.roadmaps
  for delete using (auth.uid() = user_id);


-- 6. DOCUMENTS TABLE (Document AI uploads and analysis)
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text not null,
  summary text,
  key_points jsonb default '[]'::jsonb,
  flashcards jsonb default '[]'::jsonb,
  mind_map jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for documents
alter table public.documents enable row level security;

-- RLS policies for documents
create policy "Users can view their own documents" on public.documents
  for select using (auth.uid() = user_id);

create policy "Users can insert their own documents" on public.documents
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own documents" on public.documents
  for delete using (auth.uid() = user_id);
