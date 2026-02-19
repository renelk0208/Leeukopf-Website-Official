# Product Catalog Setup Guide

This guide explains how to set up and manage your product catalog using Google Sheets for the order form at `/order-form`.

## Current Setup

The product catalog is currently stored in `/public/products.csv` in the repository with sample data. This file contains 37 sample products across 6 categories.

## Google Sheets Template

### Step 1: Create Your Google Sheet

Create a new Google Sheet with the following structure:

#### Column Headers (Row 1):
```
category | subcategory | product_name | code | size | unit | moq | price | image_url | notes | active
```

#### Column Descriptions:

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| **category** | Text | Yes | Main product category | "Builder Gel", "Gel Polish", "Top & Base" |
| **subcategory** | Text | No | Sub-category for organization | "Fiberglass", "Classic Colors", "Base Coats" |
| **product_name** | Text | Yes | Full product name | "Fiberglass Premium Clear" |
| **code** | Text | Yes | Unique product code (displayed prominently) | "FG-CL-15", "GP-RED-001" |
| **size** | Number | Yes | Product size/volume | "15", "10", "30" |
| **unit** | Text | Yes | Unit of measurement | "ml", "g", "pc", "set" |
| **moq** | Number | Yes | Minimum Order Quantity | "1", "6", "12" |
| **price** | Number | Yes | Unit price (currently set to 0 for sample) | "0" |
| **image_url** | Text | No | Path to product image | "/images/products/gel-polish-red.jpg" |
| **notes** | Text | No | Product description or notes | "Premium quality fiberglass gel" |
| **active** | Text | Yes | Show/hide product (case-insensitive) | "TRUE" or "FALSE" |

### Step 2: Add Sample Data

Here are some example rows to help you get started:

```csv
category,subcategory,product_name,code,size,unit,moq,price,image_url,notes,active
Builder Gel,Fiberglass,Fiberglass Premium Clear,FG-CL-15,15,ml,1,0,,Premium quality fiberglass gel,TRUE
Builder Gel,Fiberglass,Fiberglass Premium Clear,FG-CL-50,50,ml,1,0,,Premium quality fiberglass gel,TRUE
Gel Polish,Classic Colors,Classic Red,GP-RED-001,10,ml,6,0,/images/products/gel-polish-red.jpg,Vibrant classic red,TRUE
Top & Base,Base Coats,Rubber Base,BASE-RUB-30,30,ml,1,0,,Flexible rubber base coat,TRUE
Top & Base,Base Coats,Rubber Base,BASE-RUB-50,50,ml,1,0,,Flexible rubber base coat,TRUE
Nail Art,Pigments,Chrome Powder Silver,NA-CHR-SLV,2,g,12,0,,Mirror chrome effect,TRUE
Liquids,Cleansers,Gel Cleanser,LIQ-CLNR-100,100,ml,1,0,,Removes sticky layer,TRUE
Accessories,Tools,Crystal Nail File,ACC-FILE-001,1,pc,12,0,,Professional glass file,TRUE
```

### Step 3: Integrate with Your Website

You have two options to connect your Google Sheet to the website:

#### Option A: Publish as CSV (Simpler)

1. In Google Sheets, go to **File** → **Share** → **Publish to web**
2. In the dropdown, select the specific sheet/tab you want to publish
3. Choose **Comma-separated values (.csv)** as the format
4. Click **Publish**
5. Copy the published URL (it will look like: `https://docs.google.com/spreadsheets/d/e/2PACX-...`)

6. Update the code in `src/lib/loadProducts.ts`:

Replace this line:
```typescript
const response = await fetch('/products.csv');
```

With:
```typescript
const response = await fetch('YOUR_GOOGLE_SHEETS_CSV_URL_HERE');
```

**Pros:**
- Simple setup, no authentication needed
- Changes in Google Sheets appear immediately on the website
- No server-side code required

**Cons:**
- Google Sheet must be public (anyone with the URL can view it)
- Subject to Google's caching (updates may take a few minutes)

#### Option B: Google Sheets API (More Secure)

Use the existing Google Sheets API setup (documented in `GOOGLE_SHEETS_SETUP.md`) to fetch data server-side via a Netlify function.

**Pros:**
- Sheet can remain private
- Better control over caching and rate limiting
- More secure

**Cons:**
- Requires service account setup
- More complex configuration
- Needs environment variables in Netlify

### Step 4: Product Code Naming Conventions

For consistency, follow these naming patterns:

| Category | Pattern | Example |
|----------|---------|---------|
| Builder Gel - Fiberglass | FG-{COLOR}-{SIZE} | FG-CL-15, FG-PK-50 |
| Builder Gel - 3-in-1 | 3IN1-{COLOR}-{SIZE} | 3IN1-CL-15 |
| Builder Gel - BIAB | BIAB-{COLOR}-{SIZE} | BIAB-CL-15 |
| Gel Polish | GP-{COLOR}-{NUMBER} | GP-RED-001 |
| Top Coats | TOP-{TYPE}-{SIZE} | TOP-NW-30 |
| Base Coats | BASE-{TYPE}-{SIZE} | BASE-RUB-30 |
| Nail Art | NA-{TYPE}-{ID} | NA-CHR-SLV |
| Liquids | LIQ-{TYPE}-{SIZE} | LIQ-PREP-100 |
| Accessories | ACC-{TYPE}-{ID} | ACC-FILE-001 |

### Step 5: Managing Product Visibility

To temporarily hide a product without deleting it:
- Set the `active` column to `FALSE`
- The product will not appear on the order form
- You can re-enable it later by changing it back to `TRUE`

### Step 6: Testing Your Changes

After setting up your Google Sheet:

1. **For Option A (CSV)**: Wait 2-3 minutes for Google's cache to update
2. Visit your website at `/order-form`
3. Check that products load correctly
4. Test the search and category filters
5. Verify product codes display correctly

### Important Notes

- **Always use the exact column names** as specified above (case-sensitive)
- **Product codes must be unique** - duplicate codes will cause issues
- **MOQ (Minimum Order Quantity)** should be a positive integer
- **Size and unit** should match your actual product specifications
- **Image URLs** should be absolute paths starting with `/` or full URLs
- **Changes to published CSV** may take 2-3 minutes to appear on the site

### Troubleshooting

**Products not loading:**
- Check browser console for errors
- Verify the Google Sheets URL is correct
- Ensure the sheet is published (Option A) or shared with service account (Option B)
- Check that column names exactly match the template

**Some products missing:**
- Verify the `active` column is set to "TRUE" (case-insensitive)
- Check that the `code` column is not empty
- Look for any parsing errors in the browser console

**Categories not showing:**
- Ensure the `category` column has values for all products
- Category names are case-sensitive in filtering

### Solid Colour HEX Updates

When solid-colour swatch images are updated, run:

```bash
npm run solid:hex:python
```

This command will:
- regenerate `colour-data-0001-0400.csv`
- extract HEX/H/S/V values from `public/img/solid-colour/*.webp`
- auto-merge `Hex_Code` values into `public/data/solid-colour/pilot-80.json` by `Internal_SKU`

Expected successful output example:

```text
✅ Wrote colour-data-0001-0400.csv with 400 rows
✅ Updated 0 / 80 matched rows in public\data\solid-colour\pilot-80.json (total rows: 80)
```

Note: `Updated 0 / 80` is normal when `pilot-80.json` is already up to date.

### Support

For additional help:
- See `GOOGLE_SHEETS_SETUP.md` for API integration details
- Check existing sample data in `/public/products.csv`
- Review the order form implementation in `src/pages/OrderFormPage.tsx`
