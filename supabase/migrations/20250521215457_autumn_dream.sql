/*
  # Initial Schema Setup for Feng Shui Analysis

  1. New Tables
    - `user_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `birth_date` (date)
      - `birth_time` (time)
      - `birth_location` (text)
      - `name` (text)
      - `created_at` (timestamptz)
      - `elements` (jsonb)
      - `dominant_element` (text)
      - `favorable_elements` (text[])
      - `recommendations` (text[])

    - `products`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `shopify_url` (text)
      - `price` (numeric)
      - `elements` (text[])
      - `themes` (text[])
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create user_analyses table
CREATE TABLE IF NOT EXISTS user_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  birth_date date NOT NULL,
  birth_time time NOT NULL,
  birth_location text,
  name text,
  created_at timestamptz DEFAULT now(),
  elements jsonb NOT NULL,
  dominant_element text NOT NULL,
  favorable_elements text[] NOT NULL,
  recommendations text[] NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  shopify_url text,
  price numeric,
  elements text[] NOT NULL,
  themes text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies for user_analyses
CREATE POLICY "Users can insert their own analyses"
  ON user_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analyses"
  ON user_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for products
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);