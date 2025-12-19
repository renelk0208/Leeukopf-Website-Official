#!/usr/bin/env node

/**
 * Report Large Images Script
 * 
 * This script scans the /public and /src/assets directories for images larger than 600KB
 * and generates a sorted report of the top 20 largest images.
 * 
 * It also warns if any PNG files > 600KB remain that are used in UI imports.
 */

const fs = require('fs');
const path = require('path');

// Minimum file size to report (600KB in bytes)
const MIN_SIZE_BYTES = 600 * 1024;

// Maximum number of results to display
const MAX_RESULTS = 20;

/**
 * Recursively find all image files in a directory
 * @param {string} dir - Directory to search
 * @param {string[]} fileList - Accumulated file list
 * @returns {string[]} List of image file paths
 */
function findImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        findImageFiles(filePath, fileList);
      }
    } else {
      // Check if it's an image file
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Get file size and format for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)}MB`;
}

/**
 * Scan directory for large images
 * @param {string} dir - Directory to scan
 * @returns {Array<{path: string, size: number, ext: string}>} List of large images
 */
function scanDirectory(dir) {
  const images = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return images;
  }

  const files = findImageFiles(dir);
  
  files.forEach(filePath => {
    const stat = fs.statSync(filePath);
    
    if (stat.size > MIN_SIZE_BYTES) {
      const ext = path.extname(filePath).toLowerCase();
      images.push({
        path: filePath,
        size: stat.size,
        ext: ext
      });
    }
  });

  return images;
}

/**
 * Check if a file is referenced in source code
 * @param {string} filename - Filename to search for
 * @param {string} srcDir - Source directory to search
 * @returns {boolean} True if referenced
 */
function isFileReferenced(filename, srcDir) {
  // Simple heuristic: check if the filename appears in any .tsx, .ts, .jsx, .js files
  const sourceFiles = findSourceFiles(srcDir);
  const basename = path.basename(filename);
  
  for (const sourceFile of sourceFiles) {
    const content = fs.readFileSync(sourceFile, 'utf-8');
    if (content.includes(basename)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Find all source code files
 * @param {string} dir - Directory to search
 * @param {string[]} fileList - Accumulated file list
 * @returns {string[]} List of source file paths
 */
function findSourceFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        findSourceFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Main function
 */
function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Large Image Report');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  const projectRoot = path.resolve(__dirname, '..');
  const publicDir = path.join(projectRoot, 'public');
  const srcAssetsDir = path.join(projectRoot, 'src', 'assets');
  const srcDir = path.join(projectRoot, 'src');

  // Scan directories
  console.log(`🔍 Scanning for images > ${MIN_SIZE_BYTES / 1024}KB...`);
  console.log('');

  const publicImages = scanDirectory(publicDir);
  const srcImages = scanDirectory(srcAssetsDir);
  const allImages = [...publicImages, ...srcImages];

  if (allImages.length === 0) {
    console.log('✅ No images larger than 600KB found!');
    console.log('');
    return;
  }

  // Sort by size (largest first)
  allImages.sort((a, b) => b.size - a.size);

  // Display top results
  console.log(`📋 Top ${Math.min(MAX_RESULTS, allImages.length)} Largest Images:`);
  console.log('');

  allImages.slice(0, MAX_RESULTS).forEach((img, index) => {
    const relativePath = path.relative(projectRoot, img.path);
    const sizeStr = formatFileSize(img.size);
    console.log(`${index + 1}. ${sizeStr.padEnd(10)} ${relativePath}`);
  });

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  // Check for large PNGs that might be used in UI
  const largePngs = allImages.filter(img => img.ext === '.png');
  
  if (largePngs.length > 0) {
    console.log('⚠️  Large PNG files detected:');
    console.log('');
    
    largePngs.slice(0, 10).forEach(img => {
      const relativePath = path.relative(projectRoot, img.path);
      const sizeStr = formatFileSize(img.size);
      const referenced = isFileReferenced(img.path, srcDir);
      
      if (referenced) {
        console.log(`   ⚠️  ${sizeStr.padEnd(10)} ${relativePath} (REFERENCED IN CODE)`);
      } else {
        console.log(`   ℹ️  ${sizeStr.padEnd(10)} ${relativePath}`);
      }
    });
    
    console.log('');
    console.log('💡 Consider converting large PNGs to WebP format for better performance.');
    console.log('');
  }

  // Summary statistics
  const totalSize = allImages.reduce((sum, img) => sum + img.size, 0);
  const avgSize = totalSize / allImages.length;
  
  console.log('📈 Summary:');
  console.log(`   Total large images: ${allImages.length}`);
  console.log(`   Total size: ${formatFileSize(totalSize)}`);
  console.log(`   Average size: ${formatFileSize(avgSize)}`);
  console.log('');
  
  // Count by extension
  const extCounts = {};
  allImages.forEach(img => {
    extCounts[img.ext] = (extCounts[img.ext] || 0) + 1;
  });
  
  console.log('📊 By file type:');
  Object.entries(extCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, count]) => {
      console.log(`   ${ext}: ${count} files`);
    });
  console.log('');
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Run the script
main();
