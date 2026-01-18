CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  marketing_opt_in boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  name text NOT NULL,
  size text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  service text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  policy_versions jsonb,
  consents jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES carts(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text,
  price numeric(10, 2),
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  price numeric(10, 2) NOT NULL,
  category text,
  tags text[],
  url text,
  is_active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS posts (
  id text PRIMARY KEY,
  title text NOT NULL,
  excerpt text,
  category text,
  url text,
  published_at date
);
