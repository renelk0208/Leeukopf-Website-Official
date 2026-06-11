# Certificate Setup Instructions

## Overview
The Certificates & Compliance page has been updated to display certificate images with a blur effect. The clickable download links for SDS, PIF, and COA have been removed and replaced with a message directing customers to contact you directly.

## Required Actions

### 1. Convert PDFs to Images
You need to convert the 5 certificate PDFs to JPG images and place them in the `public/certificates/` directory:

#### Files to Convert:
1. **GMP CERTIFICATE 2025-2026.pdf** → `gmp-certificate-2025-2026.jpg`
2. **Thermitek Leaping Bunny Certificate 2024-25.pdf** → `leaping-bunny-2024-25.jpg`
3. **Thermitek Leaping Bunny certificate 2023-24.pdf** → `leaping-bunny-2023-24.jpg`
4. **Thermitek Ltd certificate 22-23 (2).pdf** → `leaping-bunny-2022-23.jpg`
5. **Thermitek Ltd certificate (Cosmetics) 21-22.pdf** → `leaping-bunny-2021-22.jpg`

#### Recommended Conversion Method:
- Open each PDF in Adobe Acrobat, Preview, or any PDF viewer
- Export/Save as JPG or PNG
- Use medium to high quality (file size around 200-500KB is fine)
- Place the resulting images in: `public/certificates/`

### 2. CSS Blur Effect
The page automatically applies a blur effect using CSS:
- Default blur: `blur(4px)`
- On hover: slightly more blur to show it's preview-only
- A "Preview Only" label appears on hover

This protects sensitive information while demonstrating that Thermitek Ltd holds these certifications.

### 3. What Changed

#### Removed:
- "Download SDS" button (line 74-76)
- "Request PIF" button (line 81-83)
- "Request COA" button (line 88-90)
- "View Certificates" button (line 95-97)

#### Added:
- "View Our Certificates" section with blurred certificate images
- Grid display showing all 5 certificates
- Information message explaining how to request full documentation
- Company name "Thermitek Ltd" is visible in blurred certificates

### 4. User Experience
Visitors will see:
- Blurred preview images of your certificates
- Company name "Thermitek Ltd" should be readable through the blur
- A message stating: "For full access to our certification documents, safety data sheets (SDS), product information files (PIF), or certificates of analysis (COA), please contact us directly."

## Testing
After adding the certificate images:
1. Navigate to `/certificates-and-compliance`
2. Verify all 5 certificate images display with blur effect
3. Hover over images to see "Preview Only" label
4. Confirm company name is visible but other details are obscured

## Notes
- The blur effect is purely CSS-based (no image editing needed)
- Images will be blurred automatically by the browser
- No need to manually blur the images before uploading
- If you want more or less blur, adjust the `blur(4px)` value in CertificatesPage.tsx line 109
