/*
  # Restructure Product Categories for New Navigation

  1. Purpose
    - Remove old categories and create new hierarchical structure
    - Support multi-level navigation with Gel Polish collections, Tops/Bases/Primers, Builder Systems
    - Add Private Label, Distributors Wanted, and showcase pages

  2. New Categories Structure
    Main Categories:
    - Gel Polish (parent)
      - French Collection
      - Solid Colours
      - Glitters
    - Tops, Bases & Primers (parent)
      - Bases (sub-parent)
        - Classic Base
        - 5-in-1 Superior Base
        - Brush-On Builder (Builder in a Bottle)
        - Flexible Base
      - Topcoats (sub-parent)
        - Wipe Off
        - Non-Wipe
        - Matt Top
        - Top Coat Effects
    - Builder Systems (parent)
      - 3-in-1 Builder Gels
      - Fibreglass
      - Premium Fibreglass
      - Acrylics (standard and fast)
      - Polygel (Acrygel)
    - Private Label (parent)
      - Bottles
      - Jars
      - Bulk
    - Distributors Wanted (parent)
      - Gelitup
      - Gender Neutral
      - The Gel Crew

  3. Security
    - Maintains existing RLS policies
*/

-- Clear existing products and categories to start fresh
DELETE FROM products;
DELETE FROM product_categories;

-- Main navigation categories
INSERT INTO product_categories (id, name, slug, description, display_order, parent_category_id)
VALUES 
  -- Level 1: Main Categories
  ('11111111-1111-1111-1111-111111111111', 'Gel Polish', 'gel-polish', 'Premium gel polish collections', 1, NULL),
  ('22222222-2222-2222-2222-222222222222', 'Tops, Bases & Primers', 'tops-bases-primers', 'Professional foundation products', 2, NULL),
  ('33333333-3333-3333-3333-333333333333', 'Builder Systems', 'builder-systems', 'Advanced building gel systems', 3, NULL),
  ('44444444-4444-4444-4444-444444444444', 'Private Label', 'private-label', 'Custom packaging solutions', 4, NULL),
  ('55555555-5555-5555-5555-555555555555', 'Distributors Wanted', 'distributors-wanted', 'Partnership opportunities', 5, NULL),

  -- Level 2: Gel Polish subcategories
  ('11111111-1111-1111-1111-111111111112', 'French Collection', 'french-collection', 'Elegant French manicure shades', 1, '11111111-1111-1111-1111-111111111111'),
  ('11111111-1111-1111-1111-111111111113', 'Solid Colours', 'solid-colours', 'Classic solid color gel polish', 2, '11111111-1111-1111-1111-111111111111'),
  ('11111111-1111-1111-1111-111111111114', 'Glitters', 'glitters', 'Sparkling glitter gel polish', 3, '11111111-1111-1111-1111-111111111111'),

  -- Level 2: Tops, Bases & Primers subcategories
  ('22222222-2222-2222-2222-222222222223', 'Bases', 'bases', 'Professional base coat products', 1, '22222222-2222-2222-2222-222222222222'),
  ('22222222-2222-2222-2222-222222222224', 'Topcoats', 'topcoats', 'Professional top coat products', 2, '22222222-2222-2222-2222-222222222222'),

  -- Level 3: Base coat products
  ('22222222-2222-2222-2222-222222222225', 'Classic Base', 'classic-base', 'Traditional base coat', 1, '22222222-2222-2222-2222-222222222223'),
  ('22222222-2222-2222-2222-222222222226', '5-in-1 Superior Base', '5-in-1-superior-base', 'Multi-benefit base coat', 2, '22222222-2222-2222-2222-222222222223'),
  ('22222222-2222-2222-2222-222222222227', 'Brush-On Builder (Builder in a Bottle)', 'brush-on-builder', 'Easy builder gel application', 3, '22222222-2222-2222-2222-222222222223'),
  ('22222222-2222-2222-2222-222222222228', 'Flexible Base', 'flexible-base', 'Flexible base coat', 4, '22222222-2222-2222-2222-222222222223'),

  -- Level 3: Top coat products
  ('22222222-2222-2222-2222-222222222229', 'Wipe Off', 'wipe-off', 'Traditional wipe-off top coat', 1, '22222222-2222-2222-2222-222222222224'),
  ('22222222-2222-2222-2222-222222222230', 'Non-Wipe', 'non-wipe', 'No-wipe top coat', 2, '22222222-2222-2222-2222-222222222224'),
  ('22222222-2222-2222-2222-222222222231', 'Matt Top', 'matt-top', 'Matte finish top coat', 3, '22222222-2222-2222-2222-222222222224'),
  ('22222222-2222-2222-2222-222222222232', 'Top Coat Effects', 'top-coat-effects', 'Special effect top coats', 4, '22222222-2222-2222-2222-222222222224'),

  -- Level 2: Builder Systems subcategories
  ('33333333-3333-3333-3333-333333333334', '3-in-1 Builder Gels', '3-in-1-builder-gels', 'Versatile 3-in-1 builder gel system', 1, '33333333-3333-3333-3333-333333333333'),
  ('33333333-3333-3333-3333-333333333335', 'Fibreglass', 'fibreglass', 'Fibreglass nail system', 2, '33333333-3333-3333-3333-333333333333'),
  ('33333333-3333-3333-3333-333333333336', 'Premium Fibreglass', 'premium-fibreglass', 'Premium fibreglass system', 3, '33333333-3333-3333-3333-333333333333'),
  ('33333333-3333-3333-3333-333333333337', 'Acrylics', 'acrylics', 'Standard and fast acrylic systems', 4, '33333333-3333-3333-3333-333333333333'),
  ('33333333-3333-3333-3333-333333333338', 'Polygel (Acrygel)', 'polygel', 'Hybrid polygel system', 5, '33333333-3333-3333-3333-333333333333'),

  -- Level 2: Private Label subcategories
  ('44444444-4444-4444-4444-444444444445', 'Bottles', 'bottles', 'Custom bottle packaging', 1, '44444444-4444-4444-4444-444444444444'),
  ('44444444-4444-4444-4444-444444444446', 'Jars', 'jars', 'Custom jar packaging', 2, '44444444-4444-4444-4444-444444444444'),
  ('44444444-4444-4444-4444-444444444447', 'Bulk', 'bulk', 'Bulk product solutions', 3, '44444444-4444-4444-4444-444444444444'),

  -- Level 2: Distributors Wanted subcategories (showcase pages)
  ('55555555-5555-5555-5555-555555555556', 'Gelitup', 'gelitup', 'Gelitup partnership showcase', 1, '55555555-5555-5555-5555-555555555555'),
  ('55555555-5555-5555-5555-555555555557', 'Gender Neutral', 'gender-neutral', 'Gender Neutral partnership showcase', 2, '55555555-5555-5555-5555-555555555555'),
  ('55555555-5555-5555-5555-555555555558', 'The Gel Crew', 'the-gel-crew', 'The Gel Crew partnership showcase', 3, '55555555-5555-5555-5555-555555555555');
