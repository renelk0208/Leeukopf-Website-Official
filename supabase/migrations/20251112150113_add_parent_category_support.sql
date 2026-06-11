/*
  # Add Parent Category Support for Subcategories

  1. Changes
    - Add `parent_category_id` column to `product_categories` table to support hierarchical categories
    - Add foreign key constraint to ensure data integrity
    - Create index for better query performance

  2. Purpose
    - Enable subcategory functionality for "Tops, Bases & Primers" navigation
    - Maintain referential integrity between parent and child categories
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_categories' AND column_name = 'parent_category_id'
  ) THEN
    ALTER TABLE product_categories ADD COLUMN parent_category_id uuid REFERENCES product_categories(id);
    CREATE INDEX IF NOT EXISTS idx_product_categories_parent_id ON product_categories(parent_category_id);
  END IF;
END $$;
