#!/usr/bin/env node

/**
 * apply-image-fixes.js
 * 
 * Reads tmp/image-audit-report.json and automatically applies safe
 * single-match replacements. Creates .bak backups for modified files
 * and inserts TODO comments noting the automated replacement.
 * 
 * Usage: node scripts/apply-image-fixes.js
 * 
 * Configuration:
 * - IMAGE_BASE: Public-facing base path for images (/img/products)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Configuration: Public-facing base path for images
const IMAGE_BASE = '/img/products';

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

/**
 * Convert a repository file path to a public-facing path
 * e.g., public/img/products/xxx.jpg -> /img/products/xxx.jpg
 */
function toPublicPath(repoPath) {
  // Remove 'public/' prefix if present
  let publicPath = repoPath.replace(/^public[/\\]/, '');
  
  // Ensure it starts with /
  if (!publicPath.startsWith('/')) {
    publicPath = '/' + publicPath;
  }
  
  // Normalize path separators
  publicPath = publicPath.replace(/\\/g, '/');
  
  return publicPath;
}

/**
 * Create a backup of a file
 */
function createBackup(filePath) {
  const backupPath = filePath + '.bak';
  
  try {
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
      return backupPath;
    }
  } catch (err) {
    log(`Warning: Failed to create backup for ${filePath}: ${err.message}`, 'yellow');
  }
  
  return null;
}

/**
 * Apply a fix to a file
 */
function applyFix(fix) {
  const filePath = path.join(rootDir, fix.file);
  
  if (!fs.existsSync(filePath)) {
    log(`  ⚠ File not found: ${fix.file}`, 'yellow');
    return false;
  }
  
  try {
    // Read file content
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Convert new reference to public path
    const newPublicPath = toPublicPath(fix.new_reference);
    
    // Try to find and replace the old reference
    const oldRef = fix.old_reference;
    
    // Patterns to try (in order of specificity)
    const replacementPatterns = [
      // Exact quoted match with src/href/poster
      { pattern: new RegExp(`((?:src|href|poster)=["'])${escapeRegex(oldRef)}(["'])`, 'g'), replace: `$1${newPublicPath}$2` },
      // Exact quoted match in imagePath
      { pattern: new RegExp(`(imagePath:\\s*["'])${escapeRegex(oldRef)}(["'])`, 'g'), replace: `$1${newPublicPath}$2` },
      // Exact match in url()
      { pattern: new RegExp(`(url\\(["']?)${escapeRegex(oldRef)}(["']?\\))`, 'g'), replace: `$1${newPublicPath}$2` },
      // Exact match in glob patterns
      { pattern: new RegExp(`(glob\\s*\\(\\s*["'])${escapeRegex(oldRef)}(["'])`, 'g'), replace: `$1${newPublicPath}$2` },
      // Direct string literal match
      { pattern: new RegExp(`(["'])${escapeRegex(oldRef)}(["'])`, 'g'), replace: `$1${newPublicPath}$2` },
    ];
    
    let replaced = false;
    for (const { pattern, replace } of replacementPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replace);
        replaced = true;
        break;
      }
    }
    
    // If no exact match found, try basename replacement with TODO comment
    if (!replaced) {
      const oldBasename = path.basename(oldRef);
      const basenamePattern = new RegExp(`(["'])[^"']*${escapeRegex(oldBasename)}(["'])`, 'g');
      
      if (basenamePattern.test(content)) {
        // Add TODO comment before the line
        const lines = content.split('\n');
        const lineIndex = fix.line - 1;
        
        if (lineIndex >= 0 && lineIndex < lines.length) {
          const indent = lines[lineIndex].match(/^\s*/)[0];
          const todoComment = `${indent}// TODO: AUTO-FIX - Verify this image path replacement: ${oldRef} -> ${newPublicPath}`;
          lines.splice(lineIndex, 0, todoComment);
          content = lines.join('\n');
          
          // Now replace the basename
          content = content.replace(basenamePattern, `$1${newPublicPath}$2`);
          replaced = true;
        }
      }
    }
    
    if (!replaced) {
      log(`  ⚠ Could not find exact match for: ${oldRef} in ${fix.file}`, 'yellow');
      return false;
    }
    
    // Only write if content changed
    if (content !== originalContent) {
      // Create backup
      createBackup(filePath);
      
      // Write updated content
      fs.writeFileSync(filePath, content, 'utf-8');
      
      log(`  ✓ Fixed: ${fix.file}`, 'green');
      log(`    ${oldRef} -> ${newPublicPath}`, 'cyan');
      return true;
    }
    
    return false;
  } catch (err) {
    log(`  ❌ Error applying fix to ${fix.file}: ${err.message}`, 'red');
    return false;
  }
}

/**
 * Escape special regex characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Main apply function
 */
async function applyFixes() {
  log('\n========================================', 'cyan');
  log('  Apply Image Fixes', 'cyan');
  log('========================================\n', 'cyan');
  
  // Step 1: Read audit report
  const reportPath = path.join(rootDir, 'tmp', 'image-audit-report.json');
  
  if (!fs.existsSync(reportPath)) {
    log('❌ Error: Audit report not found!', 'red');
    log('   Please run `npm run audit:images` first.\n', 'yellow');
    process.exit(1);
  }
  
  log('📋 Reading audit report...', 'blue');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  log(`✓ Report loaded: ${report.summary.auto_fixable} fixes available\n`, 'green');
  
  if (report.fixed_suggestions.length === 0) {
    log('✨ No auto-fixable issues found!', 'green');
    log('   All image references are either valid or need manual review.\n', 'cyan');
    process.exit(0);
  }
  
  // Step 2: Apply fixes
  log(`🔧 Applying ${report.fixed_suggestions.length} auto-fixes...\n`, 'blue');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const fix of report.fixed_suggestions) {
    const success = applyFix(fix);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Step 3: Summary
  log('\n========================================', 'cyan');
  log('  Summary', 'cyan');
  log('========================================', 'cyan');
  log(`Fixes attempted: ${report.fixed_suggestions.length}`, 'blue');
  log(`Successfully applied: ${successCount}`, 'green');
  log(`Failed: ${failCount}`, failCount > 0 ? 'red' : 'green');
  log('========================================\n', 'cyan');
  
  if (successCount > 0) {
    log('✨ Auto-fixes applied successfully!', 'green');
    log('   Backup files (.bak) have been created for modified files.', 'cyan');
    log('   Please review the changes and run tests.\n', 'yellow');
  }
  
  if (report.unmatched_references.length > 0) {
    log(`⚠️  ${report.unmatched_references.length} references still need manual review.`, 'yellow');
    log('   Check tmp/image-audit-report.json for details.\n', 'cyan');
  }
  
  // Step 4: Update report with application status
  report.fixes_applied = {
    timestamp: new Date().toISOString(),
    success_count: successCount,
    fail_count: failCount,
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  log('📊 Report updated with application status.\n', 'green');
}

// Run apply
applyFixes().catch(err => {
  log(`\n❌ Error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});
