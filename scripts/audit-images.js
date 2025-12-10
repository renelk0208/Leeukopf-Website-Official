#!/usr/bin/env node

/**
 * audit-images.js
 * 
 * This script scans the repository for product/category image references,
 * searches candidate image directories, and generates tmp/image-audit-report.json.
 * It detects single-clear filename matches and includes them in fixed_suggestions.
 * 
 * Usage: node scripts/audit-images.js
 * 
 * Output: tmp/image-audit-report.json
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

// ANSI color codes for terminal output
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

// Candidate image directories to check (in order)
const IMAGE_DIRS = [
  'public/img/products',
  'public/images/products',
  'public/assets/img/products',
  'src/assets/img/products',
  'src/images/products',
  'assets/images/products',
].map(dir => path.join(rootDir, dir));

// File patterns to scan
const FILE_PATTERNS = [
  '**/*.{js,jsx,ts,tsx}',
  '**/*.{html,htm}',
  '**/*.{css,scss,sass}',
  '**/*.{json,md}',
];

// Patterns to identify product/category image references
// Matches src="/img/products/...", url('/img/products/...'), etc.
const IMAGE_REF_PATTERNS = [
  // src, href, poster attributes
  /(?:src|href|poster)=["']([^"']*(?:product|products|category|cat|thumb|hero)[^"']*)["']/gi,
  // CSS url() patterns
  /url\(["']?([^"')]*(?:product|products|category|cat|thumb|hero)[^"')]*)["']?\)/gi,
  // import/require patterns
  /(?:import|require)\s*\(\s*["']([^"']*(?:product|products|category|cat|thumb|hero)[^"']*)["']\s*\)/gi,
  // imagePath property patterns
  /imagePath:\s*["']([^"']*(?:product|products|category|cat|thumb|hero)[^"']*)["']/gi,
  // glob patterns
  /glob\s*\(\s*["']([^"']*(?:product|products|category|cat|thumb|hero)[^"']*)["']/gi,
  // Direct string literals that look like image paths
  /["']([/]?(?:public\/)?img\/products[^"']*)["']/gi,
];

/**
 * Find all existing image files in candidate directories
 */
function findAllImages() {
  const allImages = new Map();
  
  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      continue;
    }
    
    try {
      const pattern = path.join(dir, '**/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}');
      const files = glob.sync(pattern);
      
      for (const file of files) {
        const relativePath = path.relative(rootDir, file);
        const basename = path.basename(file).toLowerCase();
        
        if (!allImages.has(basename)) {
          allImages.set(basename, []);
        }
        allImages.get(basename).push(relativePath);
      }
    } catch (err) {
      log(`Warning: Error scanning ${dir}: ${err.message}`, 'yellow');
    }
  }
  
  return allImages;
}

/**
 * Scan a file for image references
 */
function scanFile(filePath) {
  const references = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativeFilePath = path.relative(rootDir, filePath);
    
    for (const pattern of IMAGE_REF_PATTERNS) {
      // Reset regex lastIndex
      pattern.lastIndex = 0;
      
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const reference = match[1];
        
        // Skip empty or very short references
        if (!reference || reference.length < 5) {
          continue;
        }
        
        // Skip node_modules and other common false positives
        if (reference.includes('node_modules') || reference.includes('data:image')) {
          continue;
        }
        
        references.push({
          file: relativeFilePath,
          reference: reference,
          line: content.substring(0, match.index).split('\n').length,
        });
      }
    }
  } catch (err) {
    log(`Warning: Error scanning file ${filePath}: ${err.message}`, 'yellow');
  }
  
  return references;
}

/**
 * Find all source files to scan
 */
function findSourceFiles() {
  const files = [];
  
  // Scan src directory
  const srcPattern = path.join(rootDir, 'src', '**/*.{js,jsx,ts,tsx,json}');
  files.push(...glob.sync(srcPattern));
  
  // Scan public directory for HTML/CSS
  const publicPattern = path.join(rootDir, 'public', '**/*.{html,htm,css}');
  files.push(...glob.sync(publicPattern));
  
  // Scan root for config files
  const rootPattern = path.join(rootDir, '*.{js,jsx,ts,tsx,json,html,htm}');
  files.push(...glob.sync(rootPattern));
  
  return files;
}

/**
 * Find candidate matches for a reference
 */
function findCandidateMatches(reference, allImages) {
  const candidates = [];
  
  // Extract basename from reference
  const refBasename = path.basename(reference).toLowerCase();
  
  // Skip if reference doesn't look like an image
  if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(refBasename)) {
    return candidates;
  }
  
  // Look for exact basename matches
  if (allImages.has(refBasename)) {
    const matches = allImages.get(refBasename);
    candidates.push(...matches);
  }
  
  // Look for similar names (without extension)
  const refName = path.parse(refBasename).name.toLowerCase();
  for (const [basename, paths] of allImages.entries()) {
    const imageName = path.parse(basename).name.toLowerCase();
    
    // Skip exact matches (already added)
    if (basename === refBasename) {
      continue;
    }
    
    // Check for similar names (fuzzy matching)
    if (imageName.includes(refName) || refName.includes(imageName)) {
      candidates.push(...paths.map(p => ({ path: p, fuzzy: true })));
    }
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
 * Check if a reference actually exists
 */
function checkReferenceExists(reference) {
  // Try various path combinations
  const possiblePaths = [
    path.join(rootDir, reference),
    path.join(rootDir, 'public', reference),
    path.join(rootDir, reference.replace(/^\//, '')),
    path.join(rootDir, 'public', reference.replace(/^\//, '')),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return true;
    }
  }
  
  return false;
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
async function audit() {
  log('\n========================================', 'cyan');
  log('  Product/Category Image Audit', 'cyan');
  log('========================================\n', 'cyan');
  
  // Step 1: Find all existing images
  log('📂 Scanning for existing images...', 'blue');
  const allImages = findAllImages();
  log(`✓ Found ${allImages.size} unique image names across all directories\n`, 'green');
  
  // Step 2: Find all source files
  log('📄 Finding source files to scan...', 'blue');
  const sourceFiles = findSourceFiles();
  log(`✓ Found ${sourceFiles.length} source files to scan\n`, 'green');
  
  // Step 3: Scan files for image references
  log('🔍 Scanning files for image references...', 'blue');
  const allReferences = [];
  for (const file of sourceFiles) {
    const refs = scanFile(file);
    allReferences.push(...refs);
  }
  
  // Remove duplicates
  const uniqueReferences = Array.from(
    new Map(allReferences.map(r => [`${r.file}:${r.reference}`, r])).values()
  );
  
  log(`✓ Found ${uniqueReferences.length} unique image references\n`, 'green');
  
  // Step 4: Analyze each reference
  log('🔎 Analyzing references...', 'blue');
  const valid = [];
  const fixed_suggestions = [];
  const unmatched_references = [];
  
  for (const ref of uniqueReferences) {
    const exists = checkReferenceExists(ref.reference);
    
    if (exists) {
      valid.push(ref);
    } else {
      const candidates = findCandidateMatches(ref.reference, allImages);
      
      // Filter out fuzzy matches for single-match detection
      const exactCandidates = candidates.filter(c => typeof c === 'string');
      
      if (exactCandidates.length === 1) {
        // Single clear match - add to fixed_suggestions
        fixed_suggestions.push({
          ...ref,
          old_reference: ref.reference,
          new_reference: exactCandidates[0],
          candidate_matches: exactCandidates,
        });
      } else {
        // Multiple or no matches - add to unmatched
        unmatched_references.push({
          ...ref,
          candidate_matches: candidates.map(c => typeof c === 'string' ? c : c.path),
        });
      }
    }
  }
  
  log(`✓ ${valid.length} references are valid`, 'green');
  log(`✓ ${fixed_suggestions.length} references have single-clear matches (auto-fixable)`, 'cyan');
  log(`⚠ ${unmatched_references.length} references need manual review\n`, 'yellow');
  
  // Step 5: Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total_references: uniqueReferences.length,
      valid_references: valid.length,
      auto_fixable: fixed_suggestions.length,
      needs_manual_review: unmatched_references.length,
    },
    valid_references: valid,
    fixed_suggestions: fixed_suggestions,
    unmatched_references: unmatched_references,
  };
  
  // Step 6: Write report to file
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
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  
  log('📊 Report generated:', 'green');
  log(`   ${reportPath}\n`, 'cyan');
  
  // Step 7: Display summary
  log('========================================', 'cyan');
  log('  Summary', 'cyan');
  log('========================================', 'cyan');
  log(`Total references scanned: ${report.summary.total_references}`, 'blue');
  log(`Valid references: ${report.summary.valid_references}`, 'green');
  log(`Auto-fixable (single match): ${report.summary.auto_fixable}`, 'cyan');
  log(`Needs manual review: ${report.summary.needs_manual_review}`, 'yellow');
  log('========================================\n', 'cyan');
  
  if (fixed_suggestions.length > 0) {
    log('✨ Run `npm run apply:image-fixes` to auto-apply safe fixes\n', 'magenta');
  }
  
  if (unmatched_references.length > 0) {
    log('⚠️  Manual review needed for unmatched references:', 'yellow');
    unmatched_references.slice(0, 10).forEach(ref => {
      log(`   ${ref.file}: ${ref.reference}`, 'yellow');
      if (ref.candidate_matches.length > 0) {
        log(`     Candidates: ${ref.candidate_matches.slice(0, 3).join(', ')}`, 'cyan');
      }
    });
    if (unmatched_references.length > 10) {
      log(`   ... and ${unmatched_references.length - 10} more\n`, 'yellow');
    }
  }
  
  return report;
}

// Run audit
audit().catch(err => {
  log(`\n❌ Error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});
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
