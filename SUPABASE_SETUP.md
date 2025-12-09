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

