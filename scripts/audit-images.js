#!/usr/bin/env node

/**
 * audit-images.js
 * 
 * Comprehensive image audit script for Leeukopf Website
 * 
 * This script:
 * 1. Scans all source files for image references
 * 2. Validates each reference against actual files in public/img/products/
 * 3. Identifies missing images and finds candidate matches
 * 4. Auto-fixes clear single matches (Option A)
 * 5. Generates detailed audit report in tmp/image-audit-report.json
 * 
 * Usage: node scripts/audit-images.js [--fix]
 * 
 * Options:
 *   --fix    Automatically fix clear single-match references
 * Comprehensive image audit and auto-fix script for product and category images.
 * 
 * This script:
 * 1. Scans the entire codebase for image references (components, configs, JSON, CSS, etc.)
 * 2. Validates each reference exists in the file system
 * 3. Identifies missing references and suggests matches
 * 4. Auto-fixes single clear filename matches (--fix flag)
 * 5. Adds TODO comments for ambiguous cases
 * 6. Generates detailed audit report
 * 
 * Usage:
 *   node scripts/audit-images.js              # Run audit only
 *   node scripts/audit-images.js --fix        # Run audit and auto-fix clear matches
 *   npm run audit:images                      # Run via npm script
 *   npm run audit:images -- --fix             # Run with auto-fix
 * 
 * Exit codes:
 *   0: All images exist or successfully fixed
 *   1: Missing images found (without --fix) or unfixable issues remain
 * Image Audit Script for Leeukopf Website
 * 
 * This script audits all product and category images used across the website:
 * - Scans codebase for image references
 * - Verifies file existence
 * - Detects mismatches and missing images
 * - Suggests closest matches for missing files
 * - Generates comprehensive JSON audit report
 * 
 * Note: Uses synchronous filesystem operations for simplicity. This is acceptable
 * for a one-time audit tool that's run manually. Performance is negligible for
 * typical repository sizes (~100 files, ~400 images).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Find all image files in public/img/products/
 */
async function scanProductImages() {
  const productsDir = path.join(rootDir, 'public/img/products');
  const pattern = path.join(productsDir, '**/*.{jpg,JPG,jpeg,JPEG,png,PNG}');
  
  try {
    const files = await glob(pattern, { nodir: true });
    return files.map(f => ({
      fullPath: f,
      relativePath: f.replace(path.join(rootDir, 'public'), ''),
      filename: path.basename(f),
      dirname: path.dirname(f).replace(path.join(rootDir, 'public'), ''),
    }));
  } catch (error) {
    log(`Error scanning product images: ${error.message}`, 'red');
    return [];
  }
}

/**
 * Find all image files in public/img/private-label/
 */
async function scanPrivateLabelImages() {
  const privateLabelDir = path.join(rootDir, 'public/img/private-label');
  if (!fs.existsSync(privateLabelDir)) {
    return [];
  }
  
  const pattern = path.join(privateLabelDir, '**/*.{jpg,JPG,jpeg,JPEG,png,PNG}');
  
  try {
    const files = await glob(pattern, { nodir: true });
    return files.map(f => ({
      fullPath: f,
      relativePath: f.replace(path.join(rootDir, 'public'), ''),
      filename: path.basename(f),
      dirname: path.dirname(f).replace(path.join(rootDir, 'public'), ''),
    }));
  } catch (error) {
    log(`Error scanning private label images: ${error.message}`, 'red');
    return [];
  }
}

/**
 * Extract image references from a source file
 */
function extractImageReferences(filePath, content) {
  const references = [];
  
  // Pattern 1: imagePath: '/img/...' or imagePath: "/img/..."
  const imagePathRegex = /imagePath:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = imagePathRegex.exec(content)) !== null) {
    references.push({
      path: match[1],
      line: content.substring(0, match.index).split('\n').length,
      pattern: 'imagePath',
      context: content.substring(Math.max(0, match.index - 50), Math.min(content.length, match.index + match[0].length + 50)),
    });
  }
  
  // Pattern 2: src="/img/..." or src='/img/...'
  const srcRegex = /src\s*=\s*['"]([^'"]*\/img\/[^'"]+)['"]/g;
  while ((match = srcRegex.exec(content)) !== null) {
    references.push({
      path: match[1],
      line: content.substring(0, match.index).split('\n').length,
      pattern: 'src',
      context: content.substring(Math.max(0, match.index - 50), Math.min(content.length, match.index + match[0].length + 50)),
    });
  }
  
  // Pattern 3: categoryHero['key'] or categoryHero["key"] assignments
  const categoryHeroRegex = /categoryHero\[['"]([^'"]+)['"]\]\s*=\s*['"]([^'"]+)['"]/g;
  while ((match = categoryHeroRegex.exec(content)) !== null) {
    references.push({
      path: match[2],
      line: content.substring(0, match.index).split('\n').length,
      pattern: 'categoryHero',
      key: match[1],
      context: content.substring(Math.max(0, match.index - 50), Math.min(content.length, match.index + match[0].length + 50)),
    });
  }
  
  // Pattern 4: Array of image paths
  const arrayImageRegex = /['"]([^'"]*\/img\/products\/[^'"]+\.(?:jpg|jpeg|png|JPG|JPEG|PNG))['"]/g;
  while ((match = arrayImageRegex.exec(content)) !== null) {
    // Avoid duplicates from other patterns
    const isDuplicate = references.some(ref => 
      ref.path === match[1] && 
      Math.abs(ref.line - content.substring(0, match.index).split('\n').length) < 3
    );
    
    if (!isDuplicate) {
      references.push({
        path: match[1],
        line: content.substring(0, match.index).split('\n').length,
        pattern: 'array',
        context: content.substring(Math.max(0, match.index - 50), Math.min(content.length, match.index + match[0].length + 50)),
      });
    }
  }
  
  // Pattern 5: import.meta.glob patterns
  const globRegex = /import\.meta\.glob[^(]*\(\s*['"]([^'"]+)['"]/g;
  while ((match = globRegex.exec(content)) !== null) {
    references.push({
      path: match[1],
      line: content.substring(0, match.index).split('\n').length,
      pattern: 'glob',
      isPattern: true,
      context: content.substring(Math.max(0, match.index - 50), Math.min(content.length, match.index + match[0].length + 100)),
    });
  }
  
  return references;
}

/**
 * Scan all source files for image references
 */
async function scanSourceFiles() {
  const patterns = [
    path.join(rootDir, 'src/**/*.{ts,tsx}'),
    path.join(rootDir, 'src/**/*.css'),
  ];
  
  const allReferences = [];
  
  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, { nodir: true });
      
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const references = extractImageReferences(file, content);
        
        if (references.length > 0) {
          allReferences.push({
            file: file.replace(rootDir, ''),
            references,
          });
        }
      }
    } catch (error) {
      log(`Error scanning ${pattern}: ${error.message}`, 'red');
    }
  }
  
  return allReferences;
}

/**
 * Check if an image reference exists
 */
function checkImageExists(imagePath) {
  // Handle glob patterns
  if (imagePath.includes('*') || imagePath.includes('{')) {
    return { exists: true, isPattern: true };
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join(rootDir, 'public', cleanPath);
  
  return {
    exists: fs.existsSync(fullPath),
    fullPath,
    isPattern: false,
// Check if --fix flag is provided
const shouldFix = process.argv.includes('--fix');

/**
 * Scan all product image files in the public/img/products directory
 */
function scanProductImages() {
  const productsDir = path.join(rootDir, 'public/img/products');
  const images = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
        const relativePath = fullPath.replace(path.join(rootDir, 'public'), '');
        images.push({
          fullPath,
          relativePath: relativePath.replace(/\\/g, '/'),
          filename: file,
        });
      }
    }
  }

  if (fs.existsSync(productsDir)) {
    walkDir(productsDir);
  }

  return images;
}

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const TMP_DIR = path.join(ROOT_DIR, 'tmp');
const REPORT_PATH = path.join(TMP_DIR, 'image-audit-report.json');

// Ensure tmp directory exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

/**
 * Recursively find all files with given extensions
 */
function findFiles(dir, extensions, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, extensions, fileList);
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Find all actual image files in public directory
 */
function findAllImages() {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
  const images = [];
  
  function scanDir(dir, relativePath = '') {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const relPath = path.join(relativePath, file);
      
      if (stat.isDirectory()) {
        scanDir(filePath, relPath);
      } else if (imageExtensions.some(ext => file.endsWith(ext))) {
        images.push({
          path: '/' + relPath.replace(/\\/g, '/'),
          fullPath: filePath,
          name: file,
          category: extractCategory(relPath),
        });
      }
    });
  }
  
  scanDir(path.join(PUBLIC_DIR, 'img'));
  return images;
}

/**
 * Extract image references from various file types
 */
function scanCodebaseForReferences() {
  const references = [];
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.md', '.html'];
  const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.bolt'];

  function shouldScanFile(filePath) {
    // Skip excluded directories
    if (excludeDirs.some(dir => filePath.includes(`/${dir}/`) || filePath.includes(`\\${dir}\\`))) {
      return false;
    }
    
    // Check extension
    return extensions.some(ext => filePath.endsWith(ext));
  }

  function extractReferences(content, filePath) {
    const patterns = [
      // Image src attributes: src="/img/products/..."
      /(?:src|href|imagePath|image|path|url)\s*[:=]\s*['"]([^'"]*\/img\/products\/[^'"]+)['"]/g,
      // import.meta.glob patterns (skip - these are glob patterns, not actual paths)
      // /['"]\/public\/img\/products\/[^'"]+['"]/g,
      // CSS url() patterns
      /url\s*\(\s*['"]?([^'")]*\/img\/products\/[^'")]+)['"]?\s*\)/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        let imagePath = match[1] || match[0];
        
        // Clean up the path
        imagePath = imagePath.replace(/^['"]|['"]$/g, '');
        imagePath = imagePath.replace('/public', '');
        
        // Skip glob patterns (contain ** or *)
        if (imagePath.includes('**') || imagePath.includes('*')) {
          continue;
        }
        
        // Only include product image paths
        if (imagePath.includes('/img/products/')) {
          references.push({
            path: imagePath,
            file: filePath.replace(rootDir, '').replace(/\\/g, '/'),
            line: content.substring(0, match.index).split('\n').length,
          });
        }
      }
    }
  }

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!excludeDirs.includes(file)) {
          walkDir(fullPath);
        }
      } else if (shouldScanFile(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          extractReferences(content, fullPath);
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }

  walkDir(path.join(rootDir, 'src'));
  walkDir(path.join(rootDir, 'public'));
  
  // Also check specific config files
  const configFiles = [
    'package.json',
    'vite.config.ts',
    'tailwind.config.js',
  ];
  
  for (const file of configFiles) {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        extractReferences(content, fullPath);
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  // Remove duplicates
  const uniqueRefs = [];
  const seen = new Set();
  
  for (const ref of references) {
    const key = `${ref.path}|${ref.file}|${ref.line}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRefs.push(ref);
    }
  }

  return uniqueRefs;
}

/**
 * Check if an image path exists
 */
function checkImageExists(imagePath) {
  const fullPath = path.join(rootDir, 'public', imagePath.replace(/^\//, ''));
  return {
    exists: fs.existsSync(fullPath),
    fullPath,
  };
}

/**
 * Find candidate matches for a missing image
 */
function findCandidates(missingPath, availableImages) {
  const filename = path.basename(missingPath);
  const filenameWithoutExt = filename.replace(/\.[^.]+$/, '');
  
  // Find exact filename matches
  const exactMatches = availableImages.filter(img => 
    img.filename.toLowerCase() === filename.toLowerCase()
  );
  
  if (exactMatches.length > 0) {
    return {
      type: 'exact',
      matches: exactMatches,
      confidence: 'high',
    };
  }
  
  // Find similar filename matches (without extension)
  const similarMatches = availableImages.filter(img => {
    const imgFilenameWithoutExt = img.filename.replace(/\.[^.]+$/, '');
    return imgFilenameWithoutExt.toLowerCase() === filenameWithoutExt.toLowerCase();
  });
  
  if (similarMatches.length > 0) {
    return {
      type: 'similar',
      matches: similarMatches,
      confidence: 'medium',
    };
  }
  
  // Find partial matches (fuzzy)
  const partialMatches = availableImages.filter(img => {
    const imgLower = img.filename.toLowerCase();
    const searchLower = filename.toLowerCase();
    return imgLower.includes(searchLower.substring(0, Math.min(10, searchLower.length))) ||
           searchLower.includes(imgLower.substring(0, Math.min(10, imgLower.length)));
  });
  
  if (partialMatches.length > 0) {
    return {
      type: 'partial',
      matches: partialMatches.slice(0, 5), // Limit to 5 suggestions
      confidence: 'low',
    };
  }
  
  return {
    type: 'none',
    matches: [],
    confidence: 'none',
  };
}

/**
 * Fix a reference in a file
 */
function fixReference(filePath, oldPath, newPath, lineNumber) {
function findCandidateMatches(missingPath, availableImages) {
  const filename = missingPath.split('/').pop();
  const filenameWithoutExt = filename.replace(/\.[^.]+$/, '');
  
  const candidates = [];
  
  for (const img of availableImages) {
    const imgFilename = img.filename;
    const imgFilenameWithoutExt = imgFilename.replace(/\.[^.]+$/, '');
    
    // Exact filename match (case-insensitive)
    if (imgFilename.toLowerCase() === filename.toLowerCase()) {
      candidates.push({
        score: 100,
        path: img.relativePath,
        reason: 'exact filename match',
      });
    }
    // Filename without extension match
    else if (imgFilenameWithoutExt.toLowerCase() === filenameWithoutExt.toLowerCase()) {
      candidates.push({
        score: 90,
        path: img.relativePath,
        reason: 'exact filename match (different extension)',
      });
    }
    // Contains the search term
    else if (imgFilename.toLowerCase().includes(filenameWithoutExt.toLowerCase())) {
      candidates.push({
        score: 60,
        path: img.relativePath,
        reason: 'filename contains search term',
      });
    }
    // Fuzzy match on filename
    else if (filenameWithoutExt.length > 4 && 
             imgFilenameWithoutExt.toLowerCase().includes(filenameWithoutExt.toLowerCase().substring(0, Math.floor(filenameWithoutExt.length * 0.7)))) {
      candidates.push({
        score: 40,
        path: img.relativePath,
        reason: 'partial filename match',
      });
    }
  }
  
  // Sort by score
  candidates.sort((a, b) => b.score - a.score);
  
  return candidates;
}

/**
 * Auto-fix a file by replacing an old path with a new path
 */
function autoFixReference(filePath, oldPath, newPath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Replace all occurrences of the old path with the new path
    // Handle various formats: src="/path", imagePath: '/path', etc.
    content = content.replace(
      new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      newPath
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    }
    
    return false;
  } catch (error) {
    log(`  ⚠️  Error fixing file ${filePath}: ${error.message}`, 'yellow');
    return false;
  }
}

/**
 * Add a TODO comment for ambiguous cases
 */
function addTodoComment(filePath, line, missingPath, candidates) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Find the line and replace
    for (let i = Math.max(0, lineNumber - 3); i < Math.min(lines.length, lineNumber + 3); i++) {
      if (lines[i].includes(oldPath)) {
        lines[i] = lines[i].replace(oldPath, newPath);
        fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
        return true;
      }
    }
    
    // Fallback: replace first occurrence
    const newContent = content.replace(oldPath, newPath);
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      return true;
    }
    
    return false;
  } catch (error) {
    log(`Error fixing reference in ${filePath}: ${error.message}`, 'red');
    // Find the line with the reference
    const targetLineIndex = line - 1;
    if (targetLineIndex < 0 || targetLineIndex >= lines.length) {
      return false;
    }
    
    // Check if TODO already exists
    if (targetLineIndex > 0 && lines[targetLineIndex - 1].includes('TODO: Fix image path')) {
      return false; // Already has TODO
    }
    
    // Prepare TODO comment
    const indent = lines[targetLineIndex].match(/^\s*/)[0];
    const candidatesList = candidates.slice(0, 3).map(c => c.path).join(', ');
    const todoComment = `${indent}// TODO: Fix image path - Missing: ${missingPath}. Candidates: ${candidatesList}`;
    
    // Insert TODO comment
    lines.splice(targetLineIndex, 0, todoComment);
    
    // Write back
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    return true;
  } catch (error) {
    log(`  ⚠️  Error adding TODO to ${filePath}: ${error.message}`, 'yellow');
    return false;
  }
}

/**
 * Main audit function
 */
async function audit() {
  log('\n╔════════════════════════════════════════════╗', 'cyan');
  log('║   Product & Category Images Audit Tool    ║', 'cyan');
  log('╚════════════════════════════════════════════╝\n', 'cyan');
  
  if (shouldFix) {
    log('⚙️  Auto-fix mode ENABLED (Option A)\n', 'yellow');
  }
  
  // Step 1: Scan available images
  log('📁 Step 1: Scanning available product images...', 'blue');
  const productImages = await scanProductImages();
  const privateLabelImages = await scanPrivateLabelImages();
  const allImages = [...productImages, ...privateLabelImages];
  log(`   Found ${productImages.length} product images`, 'green');
  log(`   Found ${privateLabelImages.length} private label images`, 'green');
  log(`   Total: ${allImages.length} images\n`, 'green');
  
  // Step 2: Scan source files
  log('🔍 Step 2: Scanning source files for image references...', 'blue');
  const sourceReferences = await scanSourceFiles();
  const totalReferences = sourceReferences.reduce((sum, file) => sum + file.references.length, 0);
  log(`   Found ${totalReferences} image references in ${sourceReferences.length} files\n`, 'green');
  
  // Step 3: Validate references
  log('✓ Step 3: Validating image references...', 'blue');
  const validReferences = [];
  const unmatchedReferences = [];
  const fixedReferences = [];
  const candidateMatches = [];
  const skippedPatterns = [];
  
  for (const fileRef of sourceReferences) {
    for (const ref of fileRef.references) {
      const check = checkImageExists(ref.path);
      
      if (check.isPattern) {
        skippedPatterns.push({
          file: fileRef.file,
          reference: ref,
        });
        continue;
      }
      
      if (check.exists) {
        validReferences.push({
          file: fileRef.file,
          reference: ref,
        });
      } else {
        // Find candidates
        const candidates = findCandidates(ref.path, allImages);
        
        if (candidates.matches.length === 1 && candidates.confidence === 'high' && shouldFix) {
          // Auto-fix: single exact match
          const newPath = candidates.matches[0].relativePath;
          const fixed = fixReference(
            path.join(rootDir, fileRef.file),
            ref.path,
            newPath,
            ref.line
          );
          
          if (fixed) {
            fixedReferences.push({
              file: fileRef.file,
              oldPath: ref.path,
              newPath,
              line: ref.line,
              pattern: ref.pattern,
            });
            log(`   ✓ Fixed: ${ref.path} → ${newPath}`, 'green');
          } else {
            unmatchedReferences.push({
              file: fileRef.file,
              reference: ref,
              candidates: candidates.matches,
            });
          }
        } else {
          unmatchedReferences.push({
            file: fileRef.file,
            reference: ref,
            candidates: candidates.matches,
            confidence: candidates.confidence,
          });
          
          if (candidates.matches.length > 0) {
            candidateMatches.push({
              file: fileRef.file,
              reference: ref,
              candidates: candidates.matches.map(m => ({
                path: m.relativePath,
                filename: m.filename,
              })),
              confidence: candidates.confidence,
            });
          }
        }
      }
    }
  }
  
  log(`   Valid references: ${validReferences.length}`, 'green');
  log(`   Unmatched references: ${unmatchedReferences.length}`, unmatchedReferences.length > 0 ? 'yellow' : 'green');
  log(`   Fixed references: ${fixedReferences.length}`, fixedReferences.length > 0 ? 'green' : 'reset');
  log(`   Glob patterns (skipped): ${skippedPatterns.length}`, 'cyan');
  log(`   Candidate matches found: ${candidateMatches.length}\n`, candidateMatches.length > 0 ? 'yellow' : 'reset');
  
  // Step 4: Generate report
  log('📝 Step 4: Generating audit report...', 'blue');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalImages: allImages.length,
      productImages: productImages.length,
      privateLabelImages: privateLabelImages.length,
      totalReferences: totalReferences,
      validReferences: validReferences.length,
      unmatchedReferences: unmatchedReferences.length,
      fixedReferences: fixedReferences.length,
      candidateMatches: candidateMatches.length,
      skippedPatterns: skippedPatterns.length,
    },
    availableImages: allImages.map(img => ({
      path: img.relativePath,
      filename: img.filename,
      directory: img.dirname,
    })),
    allReferences: sourceReferences,
    validReferences,
    unmatchedReferences,
    fixedReferences,
    candidateMatches,
    skippedPatterns,
  };
  
  // Create tmp directory if it doesn't exist
  const tmpDir = path.join(rootDir, 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  
  const reportPath = path.join(tmpDir, 'image-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  log(`   Report saved to: ${reportPath.replace(rootDir, '.')}\n`, 'green');
  
  // Step 5: Display summary
  log('╔════════════════════════════════════════════╗', 'cyan');
  log('║              Audit Summary                 ║', 'cyan');
  log('╚════════════════════════════════════════════╝', 'cyan');
  log(`Total Images Available:     ${allImages.length}`, 'blue');
  log(`Total References Found:     ${totalReferences}`, 'blue');
  log(`Valid References:           ${validReferences.length}`, 'green');
  log(`Unmatched References:       ${unmatchedReferences.length}`, unmatchedReferences.length > 0 ? 'yellow' : 'green');
  log(`Fixed References:           ${fixedReferences.length}`, fixedReferences.length > 0 ? 'green' : 'reset');
  log(`Patterns (Skipped):         ${skippedPatterns.length}`, 'cyan');
  log(`Candidates Available:       ${candidateMatches.length}`, candidateMatches.length > 0 ? 'yellow' : 'reset');
  
  // Show unmatched references
  if (unmatchedReferences.length > 0) {
    log('\n⚠️  Unmatched References (Manual Review Required):', 'yellow');
    unmatchedReferences.forEach((item, idx) => {
      log(`\n${idx + 1}. File: ${item.file}`, 'yellow');
      log(`   Missing: ${item.reference.path}`, 'red');
      log(`   Line: ${item.reference.line}`, 'reset');
      
      if (item.candidates && item.candidates.length > 0) {
        log(`   Candidates (${item.confidence} confidence):`, 'cyan');
        item.candidates.slice(0, 3).forEach(cand => {
          log(`     - ${cand.relativePath}`, 'cyan');
        });
      } else {
        log(`   No candidates found`, 'red');
      }
    });
  }
  
  // Show fixed references
  if (fixedReferences.length > 0) {
    log('\n✓ Auto-Fixed References:', 'green');
    fixedReferences.forEach((item, idx) => {
      log(`${idx + 1}. ${item.file}:${item.line}`, 'green');
      log(`   ${item.oldPath} → ${item.newPath}`, 'cyan');
    });
  }
  
  log('\n╚════════════════════════════════════════════╝\n', 'cyan');
  
  if (unmatchedReferences.length > 0) {
    log('⚠️  Action Required:', 'yellow');
    log('   Review unmatched references in the audit report', 'yellow');
    log('   Update image paths or add missing images\n', 'yellow');
  }
  
  if (!shouldFix && candidateMatches.length > 0) {
    log('💡 Tip: Run with --fix flag to auto-fix clear matches\n', 'cyan');
  }
  
  log('✅ Audit complete!\n', 'green');
}

// Run the audit
audit().catch(error => {
  log(`\n❌ Audit failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
function runAudit() {
  log('\n================================================================================', 'cyan');
  log('  Product & Category Images - Comprehensive Audit', 'cyan');
  log('================================================================================\n', 'cyan');
  
  if (shouldFix) {
    log('🔧 Running in FIX mode - will auto-fix clear matches\n', 'yellow');
  } else {
    log('📋 Running in AUDIT-ONLY mode - use --fix to apply fixes\n', 'blue');
  }

  // Step 1: Scan available images
  log('📂 Step 1: Scanning product images...', 'blue');
  const availableImages = scanProductImages();
  log(`   ✓ Found ${availableImages.length} product images\n`, 'green');

  // Step 2: Scan codebase for references
  log('🔍 Step 2: Scanning codebase for image references...', 'blue');
  const references = scanCodebaseForReferences();
  log(`   ✓ Found ${references.length} image references\n`, 'green');

  // Step 3: Validate each reference
  log('✅ Step 3: Validating image references...', 'blue');
  
  const results = {
    all_references: references.length,
    valid_references: [],
    missing_references: [],
    fixed_references: [],
    ambiguous_references: [],
    candidate_matches: {},
  };

  for (const ref of references) {
    const { exists, fullPath } = checkImageExists(ref.path);
    
    if (exists) {
      results.valid_references.push(ref);
    } else {
      const candidates = findCandidateMatches(ref.path, availableImages);
      
      results.missing_references.push({
        ...ref,
        candidates,
      });
      
      if (candidates.length > 0) {
        results.candidate_matches[ref.path] = candidates;
      }
    }
  }

  log(`   ✓ Valid: ${results.valid_references.length}`, 'green');
  log(`   ✗ Missing: ${results.missing_references.length}`, results.missing_references.length > 0 ? 'red' : 'green');
  log('');

  // Step 4: Auto-fix if requested
  if (shouldFix && results.missing_references.length > 0) {
    log('🔧 Step 4: Applying auto-fixes...', 'yellow');
    
    for (const missing of results.missing_references) {
      const candidates = missing.candidates;
      
      // Auto-fix only if there's a single clear match (score >= 90)
      if (candidates.length === 1 && candidates[0].score >= 90) {
        const newPath = candidates[0].path;
        const filePath = path.join(rootDir, missing.file);
        
        log(`   🔧 Fixing: ${missing.path} → ${newPath}`, 'yellow');
        log(`      in ${missing.file}:${missing.line}`, 'cyan');
        
        const fixed = autoFixReference(filePath, missing.path, newPath);
        
        if (fixed) {
          results.fixed_references.push({
            ...missing,
            newPath,
          });
          log(`      ✓ Fixed successfully`, 'green');
        } else {
          log(`      ✗ Fix failed`, 'red');
        }
      }
      // Multiple candidates or ambiguous - add TODO
      else if (candidates.length > 0) {
        const filePath = path.join(rootDir, missing.file);
        
        log(`   📝 Ambiguous case: ${missing.path}`, 'magenta');
        log(`      in ${missing.file}:${missing.line}`, 'cyan');
        log(`      ${candidates.length} candidates found (scores: ${candidates.slice(0, 3).map(c => c.score).join(', ')})`, 'magenta');
        
        const addedTodo = addTodoComment(filePath, missing.line, missing.path, candidates);
        
        if (addedTodo) {
          log(`      ✓ Added TODO comment`, 'yellow');
        }
        
        results.ambiguous_references.push({
          ...missing,
          candidates: candidates.slice(0, 5), // Keep top 5 candidates
        });
      }
      // No candidates found
      else {
        log(`   ❌ No candidates: ${missing.path}`, 'red');
        log(`      in ${missing.file}:${missing.line}`, 'cyan');
        
        results.ambiguous_references.push({
          ...missing,
          candidates: [],
        });
      }
    }
    
    log('');
    log(`   ✓ Fixed: ${results.fixed_references.length}`, 'green');
    log(`   ⚠️  Ambiguous/No fix: ${results.ambiguous_references.length}`, 'yellow');
    log('');
  }

  // Step 5: Generate report
  log('📊 Step 5: Generating audit report...', 'blue');
  
  const tmpDir = path.join(rootDir, 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  
  const reportPath = path.join(tmpDir, 'image-audit-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    mode: shouldFix ? 'fix' : 'audit-only',
    summary: {
      total_references: results.all_references,
      valid_references: results.valid_references.length,
      missing_references: results.missing_references.length,
      fixed_references: results.fixed_references.length,
      ambiguous_references: results.ambiguous_references.length,
    },
    all_references: references,
    valid_references: results.valid_references,
    missing_references: results.missing_references.map(m => ({
      path: m.path,
      file: m.file,
      line: m.line,
      candidates: m.candidates.slice(0, 5),
    })),
    fixed_references: results.fixed_references,
    ambiguous_references: results.ambiguous_references,
    available_images: availableImages.map(img => img.relativePath),
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  log(`   ✓ Report saved to: tmp/image-audit-report.json\n`, 'green');

  // Summary
  log('================================================================================', 'cyan');
  log('  Audit Summary', 'cyan');
  log('================================================================================', 'cyan');
  log(`Total References:      ${results.all_references}`, 'blue');
  log(`Valid:                 ${results.valid_references.length}`, 'green');
  log(`Missing:               ${results.missing_references.length}`, results.missing_references.length > 0 ? 'red' : 'green');
  
  if (shouldFix) {
    log(`Fixed:                 ${results.fixed_references.length}`, 'green');
    log(`Ambiguous/Unfixed:     ${results.ambiguous_references.length}`, results.ambiguous_references.length > 0 ? 'yellow' : 'green');
  }
  
  log('================================================================================\n', 'cyan');

  // List ambiguous cases
  if (results.ambiguous_references.length > 0) {
    log('⚠️  Ambiguous References Requiring Manual Review:\n', 'yellow');
    
    for (const amb of results.ambiguous_references.slice(0, 10)) {
      log(`   • ${amb.path}`, 'yellow');
      log(`     Location: ${amb.file}:${amb.line}`, 'cyan');
      
      if (amb.candidates.length > 0) {
        log(`     Candidates:`, 'magenta');
        for (const cand of amb.candidates.slice(0, 3)) {
          log(`       - ${cand.path} (score: ${cand.score}, ${cand.reason})`, 'magenta');
        }
      } else {
        log(`     No candidates found`, 'red');
      }
      log('');
    }
    
    if (results.ambiguous_references.length > 10) {
      log(`   ... and ${results.ambiguous_references.length - 10} more (see report)\n`, 'yellow');
    }
  }

  // Exit code
  if (results.missing_references.length === 0 || 
      (shouldFix && results.fixed_references.length > 0 && results.ambiguous_references.length === 0)) {
    log('✅ Audit completed successfully!\n', 'green');
    return 0;
  } else if (shouldFix && results.ambiguous_references.length > 0) {
    log('⚠️  Audit completed with some items requiring manual review.\n', 'yellow');
    log('   Check tmp/image-audit-report.json for details.\n', 'yellow');
    return 1;
  } else {
    log('❌ Audit found missing references.\n', 'red');
    log('   Run with --fix to auto-fix clear matches.\n', 'yellow');
    return 1;
  }
}

// Run the audit
try {
  const exitCode = runAudit();
  process.exit(exitCode);
} catch (error) {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  log(error.stack, 'red');
  process.exit(1);
}
