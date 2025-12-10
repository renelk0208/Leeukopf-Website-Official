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
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

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
