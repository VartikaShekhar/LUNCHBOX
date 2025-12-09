# Supabase Setup Guide for Lunchbox

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard at https://supabase.com
2. Click on your project
3. Go to **Settings** > **API**
4. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 2: Create Environment File

1. In your project root (`p21-project/`), create a file named `.env`
2. Add your credentials:

```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**IMPORTANT**: Never commit the `.env` file to Git! It's already in `.gitignore`.

## Step 3: Create Database Tables

Go to your Supabase project > **SQL Editor** and run these SQL commands:

### Create Lists Table
```sql
CREATE TABLE lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read lists
CREATE POLICY "Lists are viewable by everyone" 
  ON lists FOR SELECT 
  USING (true);

-- Allow authenticated users to create lists
CREATE POLICY "Authenticated users can create lists" 
  ON lists FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

-- Allow users to update their own lists
CREATE POLICY "Users can update their own lists" 
  ON lists FOR UPDATE 
  USING (auth.uid() = creator_id);

-- Allow users to delete their own lists
CREATE POLICY "Users can delete their own lists" 
  ON lists FOR DELETE 
  USING (auth.uid() = creator_id);
```

### Create Restaurants Table
```sql
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  hours TEXT,
  rating DECIMAL(2,1),
  tags TEXT[],
  image TEXT,
  image_alt TEXT,
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read restaurants
CREATE POLICY "Restaurants are viewable by everyone" 
  ON restaurants FOR SELECT 
  USING (true);

-- Allow authenticated users to create restaurants
CREATE POLICY "Authenticated users can create restaurants" 
  ON restaurants FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update restaurants they created
CREATE POLICY "Users can update their own restaurants" 
  ON restaurants FOR UPDATE 
  USING (auth.uid() = created_by);

-- Allow users to delete restaurants they created
CREATE POLICY "Users can delete their own restaurants" 
  ON restaurants FOR DELETE 
  USING (auth.uid() = created_by);
```

### Create Function to Count Restaurants
```sql
CREATE OR REPLACE FUNCTION get_restaurant_count(list_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM restaurants
  WHERE list_id = list_uuid;
$$ LANGUAGE SQL STABLE;
```

## Step 4: Enable Email Authentication

1. Go to **Authentication** > **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if needed (optional)

## Step 5: Test the Connection

1. Restart your dev server: `npm run dev`
2. Try to sign up with a new account
3. Check Supabase dashboard > **Authentication** > **Users** to see if the user was created

## Step 6: Set Up Storage for Image Uploads

1. Go to **Storage** > **Buckets** and create a bucket named `restaurant-images`
2. Set the bucket to **Public** so uploaded photos can be rendered in the app
3. Add policies to allow authenticated users to manage their uploads:

```sql
-- Allow signed-in users to upload images
create policy "Authenticated users can upload restaurant images"
  on storage.objects for insert
  with check (bucket_id = 'restaurant-images' and auth.role() = 'authenticated');

-- Allow users to update/delete their own uploads
create policy "Users can modify their own restaurant images"
  on storage.objects for update
  using (bucket_id = 'restaurant-images' and owner = auth.uid())
  with check (bucket_id = 'restaurant-images' and owner = auth.uid());

create policy "Users can delete their own restaurant images"
  on storage.objects for delete
  using (bucket_id = 'restaurant-images' and owner = auth.uid());
```

With this bucket in place, the app will automatically upload any image file a user selects when adding a restaurant, and store the public URL in the `restaurants.image` column.

## Step 7: Add Profiles and Friends Tables

Run these SQL snippets in Supabase SQL Editor to support usernames and friends:

```sql
-- Profiles table to store public user info
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null unique,
  username text not null unique,
  name text,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Friend requests table (pending/accepted/declined)
create table friend_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references auth.users on delete cascade,
  addressee_id uuid references auth.users on delete cascade,
  status text not null default 'pending',
  created_at timestamp with time zone default now()
);

alter table friend_requests enable row level security;

create policy "Users can view requests they are part of"
  on friend_requests for select using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Users can create friend requests"
  on friend_requests for insert with check (auth.uid() = requester_id);

create policy "Addressee can update their incoming request status"
  on friend_requests for update using (auth.uid() = addressee_id);

-- Comments table (friends-only commenting enforced in app)
create table comments (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants on delete cascade,
  author_id uuid references auth.users on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

alter table comments enable row level security;

create policy "Comments are viewable by everyone"
  on comments for select using (true);

create policy "Authenticated users can create comments"
  on comments for insert with check (auth.uid() = author_id);
```

After creating these tables, new signups will automatically save `username` and `name` to `profiles`, and the Friends page will be able to search by username/email and add connections.

## Database Schema Summary

### `lists` table
- `id` (UUID, primary key)
- `title` (text, required)
- `description` (text)
- `creator_id` (UUID, foreign key to auth.users)
- `creator_name` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `restaurants` table
- `id` (UUID, primary key)
- `name` (text, required)
- `description` (text)
- `address` (text)
- `hours` (text)
- `rating` (decimal)
- `tags` (text array)
- `image` (text, URL)
- `image_alt` (text)
- `list_id` (UUID, foreign key to lists)
- `created_by` (UUID, foreign key to auth.users)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Troubleshooting

- **Can't connect**: Check that your `.env` file has the correct credentials
- **Can't create data**: Make sure Row Level Security policies are set up correctly
- **Email not sending**: Check Supabase email settings in Authentication > Email Templates
