#!/usr/bin/env node

/**
 * Build-time validation script for Instagram placeholder images
 * Ensures that placeholder images exist and are not from the /products/ directory
 */

const fs = require('fs');
const path = require('path');

const brands = ['leeukopf', 'gelitup'];
const requiredPlaceholders = 4; // Number of placeholder images per brand

let hasErrors = false;

console.log('🔍 Validating Instagram placeholder images...\n');

brands.forEach((brand) => {
  const placeholderDir = path.join(__dirname, '..', 'public', 'img', 'instagram', brand, 'placeholder');
  
  console.log(`Checking ${brand} placeholders...`);
  
  // Check if directory exists
  if (!fs.existsSync(placeholderDir)) {
    console.error(`❌ ERROR: Placeholder directory missing: ${placeholderDir}`);
    hasErrors = true;
    return;
  }
  
  // Check for each required placeholder
  for (let i = 1; i <= requiredPlaceholders; i++) {
    const placeholderPath = path.join(placeholderDir, `placeholder-${i}.jpg`);
    
    if (!fs.existsSync(placeholderPath)) {
      console.error(`❌ ERROR: Missing placeholder image: ${placeholderPath}`);
      hasErrors = true;
    } else {
      // Validate that the path doesn't contain /products/
      const relativePath = path.relative(path.join(__dirname, '..'), placeholderPath);
      if (relativePath.includes('products')) {
        console.error(`❌ ERROR: Invalid placeholder path (contains 'products'): ${relativePath}`);
        hasErrors = true;
      } else {
        console.log(`  ✅ placeholder-${i}.jpg exists`);
      }
    }
  }
  
  console.log('');
});

if (hasErrors) {
  console.error('❌ Instagram placeholder validation FAILED\n');
  console.error('Please ensure:');
  console.error('1. All placeholder images exist in /public/img/instagram/{brand}/placeholder/');
  console.error('2. Placeholder images are named placeholder-1.jpg through placeholder-4.jpg');
  console.error('3. Placeholder paths do not contain /products/\n');
  process.exit(1);
} else {
  console.log('✅ All Instagram placeholder images are valid!\n');
  process.exit(0);
}
