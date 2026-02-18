# Private Label Bottle Specification Sheet - Upload Instructions

## Overview

The Private Label Bottles page now includes a **viewable specification section** where clients can click to view a specification sheet listing all bottles that are regularly available and included in Private Label packages. The file opens in a new browser tab for easy viewing.

## Where to Place Your Specification File

### Location
Place your specification file in:
```
/public/docs/private-label/private-label-bottles-specification.pdf
```

### File Path (from project root)
```
public/docs/private-label/private-label-bottles-specification.pdf
```

## Supported File Formats

- **PDF** (Recommended): `.pdf` - Opens directly in browser
- **Excel**: `.xlsx` or `.xls` - May prompt for download depending on browser
- **Word**: `.docx` - May prompt for download depending on browser

**Note**: PDF is strongly recommended as it opens inline in most browsers for immediate viewing.

## Step-by-Step Instructions

1. **Prepare Your Specification Document**
   - Create a document listing all bottles included in Private Label pricing
   - Include specifications (dimensions, capacity, etc.)
   - Include pricing information if desired
   - Add any relevant notes or availability details

2. **Save With the Correct Filename**
   - Recommended filename: `private-label-bottles-specification.pdf`
   - Or use: `private-label-bottles-specification.xlsx` for Excel format

3. **Upload to the Correct Directory**
   - Navigate to: `/public/docs/private-label/`
   - Place your file there
   - The directory already exists and is ready to use

4. **If Using a Different Filename**
   - If you want to use a different filename, update line 331 in:
     `/src/pages/PrivateLabelBottlesPage.tsx`
   - Change the `href` attribute to match your filename:
     ```tsx
     href="/docs/private-label/YOUR-FILENAME-HERE.pdf"
     ```

## What This Looks Like to Users

Users visiting `/private-label/bottles` will see:
- A blue information box at the top of the page
- A FileText icon on the left
- Heading: "Available Bottles Specification"
- Description text explaining what the document contains
- A blue "View Specification Sheet" button

When clicked, the file **opens in a new browser tab** for immediate viewing (not downloaded).

## Example File Content Structure

Your specification sheet should include:
- List of bottle models (e.g., DH-113A, DH-227, etc.)
- Specifications for each bottle (capacity, dimensions)
- Whether each bottle is included in standard Private Label packages
- Minimum order quantities (if applicable)
- Pricing tiers or pricing information
- Available customization options (cap colors, finishes, etc.)
- Lead times or availability notes

## Testing the Viewing Feature

1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:5173/private-label/bottles`
3. Click the "View Specification Sheet" button
4. Verify the file opens in a new browser tab

## Notes

- Files in the `/public/docs/` directory are publicly accessible
- The file will be served at the URL: `/docs/private-label/private-label-bottles-specification.pdf`
- Keep filenames simple without spaces (use hyphens instead)
- Update the file whenever bottle availability or specifications change
- The file is automatically included in production builds
- **PDF format is recommended** for the best inline viewing experience

## Support

If you need help or have questions, refer to the README in `/public/docs/private-label/README.md`
