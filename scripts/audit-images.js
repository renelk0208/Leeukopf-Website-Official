#!/usr/bin/env node

/**
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
