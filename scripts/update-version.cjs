#!/usr/bin/env node

/**
 * Update version.json with current build information
 * This script is run during the build process to track deployments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const versionFilePath = path.join(__dirname, '..', 'public', 'version.json');

// Get git information
let commit = 'unknown';
let branch = 'unknown';

try {
  commit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
} catch (error) {
  console.warn('Warning: Could not get git information:', error.message);
}

// Read package.json for version
let packageVersion = '1.0.0';
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
  );
  packageVersion = packageJson.version;
} catch (error) {
  console.warn('Warning: Could not read package.json:', error.message);
}

// Create version object
const versionInfo = {
  version: packageVersion,
  buildDate: new Date().toISOString(),
  commit: commit,
  branch: branch,
  message: 'Build deployed successfully'
};

// Write version file
try {
  fs.writeFileSync(versionFilePath, JSON.stringify(versionInfo, null, 2));
  console.log('✓ Version file updated successfully');
  console.log('  Version:', versionInfo.version);
  console.log('  Build Date:', versionInfo.buildDate);
  console.log('  Commit:', versionInfo.commit);
  console.log('  Branch:', versionInfo.branch);
} catch (error) {
  console.error('Error writing version file:', error.message);
  process.exit(1);
}
