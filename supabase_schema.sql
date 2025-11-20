-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (linked to auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  currency text default 'INR',
  theme text default 'light',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create transactions table
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount numeric not null,
  category text,
  description text,
  date timestamp with time zone not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create loans table
create table loans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  person_name text not null,
  amount numeric not null,
  date timestamp with time zone not null,
  status text check (status in ('pending', 'paid')) default 'pending',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table transactions enable row level security;
alter table loans enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Transactions policies
create policy "Users can view own transactions" on transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert own transactions" on transactions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own transactions" on transactions
  for update using (auth.uid() = user_id);

create policy "Users can delete own transactions" on transactions
  for delete using (auth.uid() = user_id);

-- Loans policies
create policy "Users can view own loans" on loans
  for select using (auth.uid() = user_id);

create policy "Users can insert own loans" on loans
  for insert with check (auth.uid() = user_id);

create policy "Users can update own loans" on loans
  for update using (auth.uid() = user_id);

create policy "Users can delete own loans" on loans
  for delete using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
