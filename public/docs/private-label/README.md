# Private Label Documents

This directory contains downloadable specification documents for Private Label services.

## Bottle Specifications

To display a downloadable bottle specification sheet on the Private Label Bottles page:

1. **Create your specification file** showing which bottles are included in private label pricing packages
   - Supported formats: PDF, Excel (.xlsx, .xls), Word (.docx)
   - Recommended filename: `private-label-bottles-specification.pdf`

2. **Place the file in this directory**: `/public/docs/private-label/`
   - Example: `/public/docs/private-label/private-label-bottles-specification.pdf`

3. **The file will be automatically accessible** via the download button on the Bottles page at `/private-label/bottles`

## Example Files

- `private-label-bottles-specification.pdf` - Main bottle specification and pricing sheet
- `bottle-dimensions-and-specs.xlsx` - Detailed technical specifications
- `available-bottles-list.pdf` - Quick reference guide

## Notes

- Keep filenames descriptive and without spaces (use hyphens or underscores)
- Files placed here are publicly accessible via the website
- Update the PrivateLabelBottlesPage.tsx component if you change the filename
