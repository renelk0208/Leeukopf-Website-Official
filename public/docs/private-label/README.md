# Private Label Documents

This directory contains viewable specification documents for Private Label services.

## Bottle Specifications

To display a viewable bottle specification sheet on the Private Label Bottles page:

1. **Create your specification file** showing which bottles are included in private label pricing packages
   - **Recommended format: PDF** (opens inline in browsers for best viewing experience)
   - Alternative formats: Excel (.xlsx, .xls), Word (.docx) - may prompt download
   - Recommended filename: `private-label-bottles-specification.pdf`

2. **Place the file in this directory**: `/public/docs/private-label/`
   - Example: `/public/docs/private-label/private-label-bottles-specification.pdf`

3. **The file will be viewable** via the button on the Bottles page at `/private-label/bottles`
   - Clicking the button opens the file in a new browser tab
   - Users can view the specifications without downloading

## Example Files

- `private-label-bottles-specification.pdf` - Main bottle specification and pricing sheet
- `bottle-dimensions-and-specs.xlsx` - Detailed technical specifications
- `available-bottles-list.pdf` - Quick reference guide

## Notes

- Keep filenames descriptive and without spaces (use hyphens or underscores)
- Files placed here are publicly accessible via the website
- **PDF is strongly recommended** for inline viewing in browsers
- Update the PrivateLabelBottlesPage.tsx component if you change the filename
