#!/usr/bin/env node

/**
 * audit-images.js
 * 
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
 * Extract category from image path
 */
function extractCategory(relPath) {
  const parts = relPath.split(/[/\\]/);
  if (parts.includes('products')) {
    const idx = parts.indexOf('products');
    return parts.slice(idx + 1, idx + 3).join('/');
  }
  if (parts.includes('private-label')) {
    return 'private-label';
  }
  return parts[0] || 'other';
}

/**
 * Extract image references from a file
 */
function extractImageReferences(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const references = [];
  const relativePath = path.relative(ROOT_DIR, filePath);
  
  // Pattern 1: Direct string paths with /img/
  const directPaths = content.matchAll(/['"`](\/(img|public\/img)\/[^'"`]+?\.(jpg|jpeg|png|JPG|JPEG|PNG))['"`]/g);
  for (const match of directPaths) {
    references.push({
      file: relativePath,
      line: getLineNumber(content, match.index),
      path: match[1].replace('/public/img', '/img'),
      type: 'direct',
    });
  }
  
  // Pattern 2: import.meta.glob patterns
  const globPatterns = content.matchAll(/import\.meta\.glob[^(]*\([^'"`]*['"`]([^'"`]+)['"`]/g);
  for (const match of globPatterns) {
    references.push({
      file: relativePath,
      line: getLineNumber(content, match.index),
      path: match[1],
      type: 'glob',
    });
  }
  
  // Pattern 3: Image paths in objects/configs
  const configPaths = content.matchAll(/imagePath\s*:\s*['"`](\/[^'"`]+?\.(jpg|jpeg|png|JPG|JPEG|PNG))['"`]/g);
  for (const match of configPaths) {
    references.push({
      file: relativePath,
      line: getLineNumber(content, match.index),
      path: match[1],
      type: 'config',
    });
  }
  
  // Pattern 4: src= in JSX
  const srcPaths = content.matchAll(/src\s*=\s*{?['"`](\/[^'"`]*?\.(jpg|jpeg|png|JPG|JPEG|PNG))['"`]}?/g);
  for (const match of srcPaths) {
    references.push({
      file: relativePath,
      line: getLineNumber(content, match.index),
      path: match[1],
      type: 'jsx-src',
    });
  }
  
  return references;
}

/**
 * Get line number for a character index
 */
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

/**
 * Check if image path exists
 */
function checkImageExists(imagePath) {
  // Normalize path
  let checkPath = imagePath;
  if (checkPath.startsWith('/img/')) {
    checkPath = path.join(PUBLIC_DIR, checkPath.substring(1));
  } else if (checkPath.startsWith('/')) {
    checkPath = path.join(PUBLIC_DIR, checkPath);
  }
  
  // Check with exact case
  if (fs.existsSync(checkPath)) {
    return { exists: true, path: checkPath };
  }
  
  // Check case-insensitive for Lamps/lamps issue
  const dir = path.dirname(checkPath);
  const file = path.basename(checkPath);
  
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const found = files.find(f => f.toLowerCase() === file.toLowerCase());
    if (found) {
      return { exists: true, path: path.join(dir, found), corrected: true };
    }
  }
  
  return { exists: false, path: checkPath };
}

/**
 * Find closest matching images for a missing file
 */
function findClosestMatches(missingPath, availableImages, maxResults = 3) {
  const fileName = path.basename(missingPath).toLowerCase();
  const fileNameWithoutExt = fileName.replace(/\.(jpg|jpeg|png)$/i, '');
  const pathParts = missingPath.toLowerCase().split('/').filter(p => p);
  
  const scored = availableImages.map(img => {
    let score = 0;
    const imgName = img.name.toLowerCase();
    const imgNameWithoutExt = imgName.replace(/\.(jpg|jpeg|png)$/i, '');
    const imgParts = img.path.toLowerCase().split('/').filter(p => p);
    
    // Exact filename match (without extension)
    if (imgNameWithoutExt === fileNameWithoutExt) score += 100;
    
    // Partial filename match
    if (imgNameWithoutExt.includes(fileNameWithoutExt) || fileNameWithoutExt.includes(imgNameWithoutExt)) {
      score += 50;
    }
    
    // Category match
    const missingCategory = pathParts.find(p => ['gel_polishes', 'builder-systems', 'tops-and-bases', 'primers-and-liquids', 'nail-art', 'lamps'].includes(p));
    if (missingCategory && img.category.includes(missingCategory)) {
      score += 30;
    }
    
    // Word overlap in filename
    const missingWords = fileNameWithoutExt.split(/[-_\s]+/);
    const imgWords = imgNameWithoutExt.split(/[-_\s]+/);
    const wordMatches = missingWords.filter(w => imgWords.includes(w)).length;
    score += wordMatches * 10;
    
    // Path depth similarity
    const depthDiff = Math.abs(pathParts.length - imgParts.length);
    if (depthDiff === 0) score += 5;
    
    return { ...img, score };
  });
  
  return scored
    .filter(img => img.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ path, score }) => ({ path, score }));
}

/**
 * Detect category mismatches
 */
function detectCategoryMismatches(references) {
  const mismatches = [];
  const categoryKeywords = {
    'polygel': ['polygel', 'acrygel', 'acry'],
    'builder': ['builder', '3-in-1', 'three-in-one', 'premium'],
    'gel-polish': ['gel_polish', 'gel-polish', 'cream', 'glitter', 'cat-eye', 'solid', 'transparent'],
    'tops-bases': ['tops', 'bases', 'rubber', 'brush-on'],
    'primers': ['primer', 'liquid'],
    'nail-art': ['nail-art', '3d', 'mirror', 'powder'],
    'lamps': ['lamp', 'comfort', 'quick-cure'],
  };
  
  references.forEach(ref => {
    if (ref.type === 'config' || ref.type === 'direct') {
      const pathLower = ref.path.toLowerCase();
      const fileContext = ref.file.toLowerCase();
      
      // Try to detect which category this file is about
      let expectedCategory = null;
      for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(kw => fileContext.includes(kw))) {
          expectedCategory = cat;
          break;
        }
      }
      
      if (expectedCategory) {
        // Check if the image path matches the expected category
        let pathCategory = null;
        for (const [cat, keywords] of Object.entries(categoryKeywords)) {
          if (keywords.some(kw => pathLower.includes(kw))) {
            pathCategory = cat;
            break;
          }
        }
        
        if (pathCategory && pathCategory !== expectedCategory) {
          mismatches.push({
            file: ref.file,
            line: ref.line,
            imagePath: ref.path,
            expectedCategory,
            actualCategory: pathCategory,
            confidence: 'medium',
          });
        }
      }
    }
  });
  
  return mismatches;
}

/**
 * Main audit function
 */
async function auditImages() {
  console.log('🔍 Starting image audit...\n');
  
  // Step 1: Find all code files
  console.log('📂 Scanning code files...');
  const codeFiles = [
    ...findFiles(SRC_DIR, ['.tsx', '.ts', '.jsx', '.js']),
    ...findFiles(path.join(ROOT_DIR, 'public', 'data'), ['.json']),
  ];
  console.log(`   Found ${codeFiles.length} files to scan\n`);
  
  // Step 2: Extract all image references
  console.log('🔎 Extracting image references...');
  const allReferences = [];
  codeFiles.forEach(file => {
    const refs = extractImageReferences(file);
    allReferences.push(...refs);
  });
  console.log(`   Found ${allReferences.length} image references\n`);
  
  // Step 3: Find all available images
  console.log('🖼️  Scanning available images...');
  const availableImages = findAllImages();
  console.log(`   Found ${availableImages.length} images in public directory\n`);
  
  // Step 4: Check existence and categorize
  console.log('✅ Validating image references...');
  const validReferences = [];
  const missingReferences = [];
  const fixedReferences = [];
  
  allReferences.forEach(ref => {
    // Skip glob patterns for now
    if (ref.type === 'glob') {
      return;
    }
    
    const check = checkImageExists(ref.path);
    
    if (check.exists) {
      if (check.corrected) {
        fixedReferences.push({
          ...ref,
          originalPath: ref.path,
          correctedPath: check.path.replace(PUBLIC_DIR, '').replace(/\\/g, '/'),
        });
      } else {
        validReferences.push(ref);
      }
    } else {
      const matches = findClosestMatches(ref.path, availableImages);
      missingReferences.push({
        ...ref,
        candidateMatches: matches,
      });
    }
  });
  
  console.log(`   ✅ Valid: ${validReferences.length}`);
  console.log(`   🔧 Fixed (case): ${fixedReferences.length}`);
  console.log(`   ❌ Missing: ${missingReferences.length}\n`);
  
  // Step 5: Detect category mismatches
  console.log('🔄 Detecting category mismatches...');
  const mismatches = detectCategoryMismatches(allReferences);
  console.log(`   Found ${mismatches.length} potential mismatches\n`);
  
  // Step 6: Categorize available images
  const imagesByCategory = {};
  availableImages.forEach(img => {
    if (!imagesByCategory[img.category]) {
      imagesByCategory[img.category] = [];
    }
    imagesByCategory[img.category].push(img.path);
  });
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalReferences: allReferences.length,
      validReferences: validReferences.length,
      missingReferences: missingReferences.length,
      fixedReferences: fixedReferences.length,
      categoryMismatches: mismatches.length,
      availableImages: availableImages.length,
    },
    all_references: allReferences,
    valid_references: validReferences,
    missing_references: missingReferences,
    fixed_references: fixedReferences,
    category_mismatches: mismatches,
    available_images_by_category: imagesByCategory,
    recommendations: generateRecommendations(missingReferences, fixedReferences, mismatches),
  };
  
  // Write report
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`📊 Report generated: ${REPORT_PATH}\n`);
  
  // Print summary
  printSummary(report);
  
  return report;
}

/**
 * Generate recommendations
 */
function generateRecommendations(missing, fixed, mismatches) {
  const recommendations = [];
  
  if (fixed.length > 0) {
    recommendations.push({
      type: 'case-sensitivity',
      priority: 'high',
      message: `${fixed.length} image references have case sensitivity issues. Update paths to match exact file names.`,
      files: [...new Set(fixed.map(f => f.file))],
    });
  }
  
  if (missing.length > 0) {
    const withMatches = missing.filter(m => m.candidateMatches.length > 0);
    const withoutMatches = missing.filter(m => m.candidateMatches.length === 0);
    
    if (withMatches.length > 0) {
      recommendations.push({
        type: 'missing-with-matches',
        priority: 'high',
        message: `${withMatches.length} missing images have potential matches. Review and update references.`,
        files: [...new Set(withMatches.map(f => f.file))],
      });
    }
    
    if (withoutMatches.length > 0) {
      recommendations.push({
        type: 'missing-no-matches',
        priority: 'critical',
        message: `${withoutMatches.length} missing images have no close matches. Manual review required.`,
        files: [...new Set(withoutMatches.map(f => f.file))],
      });
    }
  }
  
  if (mismatches.length > 0) {
    recommendations.push({
      type: 'category-mismatch',
      priority: 'medium',
      message: `${mismatches.length} potential category mismatches detected. Review for correctness.`,
      files: [...new Set(mismatches.map(m => m.file))],
    });
  }
  
  return recommendations;
}

/**
 * Print summary
 */
function printSummary(report) {
  console.log('═══════════════════════════════════════════════════');
  console.log('                 AUDIT SUMMARY');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Total References:     ${report.summary.totalReferences}`);
  console.log(`Valid References:     ${report.summary.validReferences} ✅`);
  console.log(`Missing References:   ${report.summary.missingReferences} ❌`);
  console.log(`Fixed References:     ${report.summary.fixedReferences} 🔧`);
  console.log(`Category Mismatches:  ${report.summary.categoryMismatches} 🔄`);
  console.log(`Available Images:     ${report.summary.availableImages} 🖼️`);
  console.log('═══════════════════════════════════════════════════\n');
  
  if (report.recommendations.length > 0) {
    console.log('📋 RECOMMENDATIONS:\n');
    report.recommendations.forEach((rec, idx) => {
      const icon = rec.priority === 'critical' ? '🚨' : rec.priority === 'high' ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${idx + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
      console.log(`   Affected files: ${rec.files.length}`);
      if (rec.files.length <= 3) {
        rec.files.forEach(f => console.log(`     - ${f}`));
      } else {
        rec.files.slice(0, 3).forEach(f => console.log(`     - ${f}`));
        console.log(`     ... and ${rec.files.length - 3} more`);
      }
      console.log();
    });
  }
}

// Run audit
auditImages().catch(err => {
  console.error('❌ Error running audit:', err);
  process.exit(1);
});
