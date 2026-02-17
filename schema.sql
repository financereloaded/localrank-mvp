-- LocalRank Database Schema
-- Run this SQL in Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keywords table
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rankings table
CREATE TABLE IF NOT EXISTS rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  position INTEGER,
  page INTEGER,
  url TEXT,
  serp_type TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citations table
CREATE TABLE IF NOT EXISTS citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitors table
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust as needed for your app)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete their own data" ON users FOR DELETE USING (auth.uid() = id);

-- For locations
CREATE POLICY "Users can view their locations" ON locations FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth.uid() = id));
CREATE POLICY "Users can insert their locations" ON locations FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth.uid() = id));
CREATE POLICY "Users can update their locations" ON locations FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth.uid() = id));
CREATE POLICY "Users can delete their locations" ON locations FOR DELETE USING (user_id IN (SELECT id FROM users WHERE auth.uid() = id));

-- For keywords
CREATE POLICY "Users can view their keywords" ON keywords FOR SELECT USING (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));
CREATE POLICY "Users can insert their keywords" ON keywords FOR INSERT WITH CHECK (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));
CREATE POLICY "Users can update their keywords" ON keywords FOR UPDATE USING (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));
CREATE POLICY "Users can delete their keywords" ON keywords FOR DELETE USING (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));

-- For rankings
CREATE POLICY "Users can view their rankings" ON rankings FOR SELECT USING (keyword_id IN (SELECT id FROM keywords WHERE location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id))));
CREATE POLICY "Users can insert their rankings" ON rankings FOR INSERT WITH CHECK (keyword_id IN (SELECT id FROM keywords WHERE location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id))));
CREATE POLICY "Users can update their rankings" ON rankings FOR UPDATE USING (keyword_id IN (SELECT id FROM keywords WHERE location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id))));
CREATE POLICY "Users can delete their rankings" ON rankings FOR DELETE USING (keyword_id IN (SELECT id FROM keywords WHERE location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id))));

-- For citations
CREATE POLICY "Users can view their citations" ON citations FOR SELECT USING (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));
CREATE POLICY "Users can insert their citations" ON citations FOR INSERT WITH CHECK (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));
CREATE POLICY "Users can update their citations" ON citations FOR UPDATE USING (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));
CREATE POLICY "Users can delete their citations" ON citations FOR DELETE USING (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));

-- For competitors
CREATE POLICY "Users can view their competitors" ON competitors FOR SELECT USING (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));
CREATE POLICY "Users can insert their competitors" ON competitors FOR INSERT WITH CHECK (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));
CREATE POLICY "Users can update their competitors" ON competitors FOR UPDATE USING (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));
CREATE POLICY "Users can delete their competitors" ON competitors FOR DELETE USING (location_id IN (SELECT id FROM locations WHERE user_id IN (SELECT id FROM users WHERE auth.uid() = id)));
