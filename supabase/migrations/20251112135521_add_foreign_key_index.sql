/*
  # Add Foreign Key Index for Performance

  1. Performance Optimization
    - Add index on `products.category_id` to improve query performance
    - This index covers the foreign key `products_category_id_fkey`
    - Optimizes JOIN operations between products and product_categories tables
  
  2. Notes
    - Foreign key indexes are crucial for query performance
    - Without this index, queries filtering by category_id require full table scans
    - This is especially important as the products table grows
*/

-- Add index on category_id foreign key
CREATE INDEX IF NOT EXISTS idx_products_category_id 
ON products(category_id);
