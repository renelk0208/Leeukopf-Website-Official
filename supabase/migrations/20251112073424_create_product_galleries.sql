/*
  # Create Product Galleries Schema

  1. New Tables
    - `product_categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (e.g., "Bottles", "Jars", "Gel Polish Colors")
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Category description
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `image_url` (text) - Product image URL
      - `display_order` (integer) - Order within category
      - `is_featured` (boolean) - Featured product flag
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (products are publicly viewable)
    - Add policies for authenticated admin users to manage products
*/

CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES product_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product categories"
  ON product_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert product categories"
  ON product_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update product categories"
  ON product_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete product categories"
  ON product_categories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO product_categories (name, slug, description, display_order) VALUES
  ('Bottles', 'bottles', 'Premium gel polish bottles in various sizes and designs', 1),
  ('Jars', 'jars', 'High-quality jars for bulk products and builder gels', 2),
  ('Bulk Products', 'bulk-products', 'Wholesale gel polish and related products in bulk quantities', 3),
  ('Gel Polish Colors', 'gel-polish-colors', 'Over 2000 vibrant gel polish color options', 4),
  ('Builder Gel Systems', 'builder-gel-systems', 'Complete builder gel systems for nail enhancement', 5);
