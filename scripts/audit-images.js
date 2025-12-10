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
