#!/usr/bin/env node

/**
 * check-images.js
 * 
 * This script validates that all category images referenced in productCategories.ts
 * actually exist in the public directory.
 * 
 * Usage: node scripts/check-images.js
 * 
 * Exit codes:
 * - 0: All images exist
 * - 1: Missing images or empty image paths found
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function extractImagePaths() {
  const categoriesFile = path.join(rootDir, 'src/data/productCategories.ts');
  
  if (!fs.existsSync(categoriesFile)) {
    log(`ERROR: productCategories.ts not found at ${categoriesFile}`, 'red');
    return null;
  }

  const content = fs.readFileSync(categoriesFile, 'utf-8');
  
  // Extract all imagePath values using regex
  // Matches: imagePath: '/img/...' or imagePath: "/img/..."
  const imagePathRegex = /imagePath:\s*['"]([^'"]+)['"]/g;
  const matches = [...content.matchAll(imagePathRegex)];
  
  if (matches.length === 0) {
    log('WARNING: No imagePath entries found in productCategories.ts', 'yellow');
    return [];
  }

  return matches.map(match => match[1]);
}

function checkImageExists(imagePath) {
  // Remove leading slash and construct full path
  const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join(rootDir, 'public', relativePath);
  
  return {
    imagePath,
    fullPath,
    exists: fs.existsSync(fullPath),
  };
}

function main() {
  log('\n========================================', 'cyan');
  log('  Image & Category Validation Check', 'cyan');
  log('========================================\n', 'cyan');

  // Extract image paths from productCategories.ts
  log('📂 Parsing productCategories.ts...', 'blue');
  const imagePaths = extractImagePaths();
  
  if (imagePaths === null) {
    process.exit(1);
  }

  if (imagePaths.length === 0) {
    log('⚠️  No categories found to validate', 'yellow');
    process.exit(0);
  }

  log(`✓ Found ${imagePaths.length} category image(s) to validate\n`, 'green');

  // Check each image
  const results = imagePaths.map(checkImageExists);
  
  // Separate results
  const missing = results.filter(r => !r.exists);
  const empty = imagePaths.filter(p => !p || p.trim() === '');

  // Report results
  log('🔍 Validation Results:\n', 'blue');

  if (empty.length > 0) {
    log(`❌ Found ${empty.length} empty imagePath(es):`, 'red');
    empty.forEach(p => {
      log(`   - Empty or whitespace-only path`, 'red');
    });
    log('');
  }

  if (missing.length > 0) {
    log(`❌ Found ${missing.length} missing image(s):`, 'red');
    missing.forEach(({ imagePath, fullPath }) => {
      log(`   - ${imagePath}`, 'red');
      log(`     Expected at: ${fullPath}`, 'yellow');
    });
    log('');
  }

  const valid = results.filter(r => r.exists);
  if (valid.length > 0) {
    log(`✓ ${valid.length} image(s) validated successfully`, 'green');
  }

  // Summary
  log('\n========================================', 'cyan');
  log('  Summary', 'cyan');
  log('========================================', 'cyan');
  log(`Total categories: ${imagePaths.length}`, 'blue');
  log(`Valid images: ${valid.length}`, 'green');
  log(`Missing images: ${missing.length}`, missing.length > 0 ? 'red' : 'green');
  log(`Empty paths: ${empty.length}`, empty.length > 0 ? 'red' : 'green');
  log('========================================\n', 'cyan');

  // Exit with error if there are issues
  if (missing.length > 0 || empty.length > 0) {
    log('❌ Image/category validation FAILED', 'red');
    log('Please fix the missing or empty image paths before committing.\n', 'yellow');
    process.exit(1);
  }

  log('✅ All image/category validations PASSED\n', 'green');
  process.exit(0);
}

main();
