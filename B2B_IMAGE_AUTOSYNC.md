# B2B Image Auto-Sync Guide

## Where to add new B2B category images

Use this folder structure for all future B2B uploads:

- `public/img/b2b/<category-slug>/<subcategory-slug>/...`

Examples:

- `public/img/b2b/builder-gels/biab/LC-BIAB-011.webp`
- `public/img/b2b/polygels/liquid-polygel/LC_UGL01.webp`
- `public/img/b2b/solid-colours/cat-eye/LC-CAT-001.webp`

You can still keep legacy images in existing folders (`/img/builder-gels`, `/img/polygel`, etc), but new uploads should go into `public/img/b2b/**`.

## Automatic command (run after new uploads)

Run:

- `npm run sync:b2b-assets`

This command will:

1. Regenerate B2B rows in `public/products.csv` from `public/img/b2b/**`
2. Regenerate `public/data/b2b-image-index.json`
3. Validate B2B category images
4. Validate B2B image quality
5. Validate B2B subcategory routes
6. Validate B2B order-flow invariants

## Automatic GitHub run (already enabled)

The workflow [b2b-assets-autosync.yml](.github/workflows/b2b-assets-autosync.yml) now runs automatically on pushes to `main` when B2B-relevant files change.

It will:

1. Run `npm run sync:b2b-assets`
2. Auto-commit generated B2B files (`public/products.csv` and `public/data/b2b-image-index.json`) if changed
3. Push that update back to `main`

This means Netlify receives a synced B2B image index without you manually regenerating it.

## Netlify safety

The same B2B index generation + validations run in build hooks (`prebuild`), so pushing to GitHub/Netlify will re-check everything automatically.

## Important naming rule

For automatic mapping by code, image filename base should include the product code (same style as in `public/products.csv`), for example:

- `LC-BIAB-011.webp`
- `LC_UGL01.webp`

The system normalizes dashes/underscores/case when matching.

## New categories

Adding images alone does not create new navigation cards. For a truly new B2B category/menu item, also add it in:

- `src/b2b/config/categories.ts`

If the category needs a new route/page, wire it in:

- `src/App.tsx`
