# B2B Image Upload Checklist

Use this checklist for all new B2B product image uploads.

## 1) Where to upload images

Upload images under `public/img` using category folders. Current supported B2B sources include:

- `public/img/builder-gels/**`
- `public/img/polygel/**`
- `public/img/liquid-polygel/**`
- `public/img/solid-colour/**`
- `public/img/tops-bases/**`
- `public/img/products/gel_polishes/**`
- `public/img/products/tops-and-bases/**`

You can keep using folder-by-folder structure inside those paths.

## 2) File naming rule (critical)

Name files using the **product code** so auto-matching works.

Examples:

- `LC_UGN-NHEAT-01.webp`
- `LC-ACY-PG-01.webp`
- `LC-GP-1200.webp`
- `LC-Extra_Strength_Base01.png`

The auto-index normalizes separators (`-`, `_`, spaces), but exact product code naming is still best.

## 3) Preferred formats

- Preferred: `.webp`
- Supported: `.png`, `.jpg`, `.jpeg`

## 4) What happens automatically

During `predev` and `prebuild`, the repo generates:

- `public/data/b2b-image-index.json`

Script:

- `scripts/generate-b2b-image-index.cjs`

This means newly uploaded files are discoverable without manual page-by-page code edits.

## 5) Local verification

After uploading images locally:

1. Run `npm run build` (or restart `npm run dev` if already running).
2. Confirm generator output shows a successful B2B image index build.
3. Open target B2B routes and verify images render.

## 6) Deployment behavior

Netlify runs the same prebuild pipeline, so uploaded images + index are regenerated on deploy.

## 7) Important notes

- Do **not** edit files in `node_modules` for portal behavior.
- Keep images inside `public/img` paths listed above.
- If an image still does not show, first verify the filename matches the product code used in `products.csv`/manifest.
