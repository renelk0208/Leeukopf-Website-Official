#!/usr/bin/env node
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Ensure output directories exist
mkdirSync(join(projectRoot, 'public', 'icons'), { recursive: true });

const SOURCE_IMAGE = join(projectRoot, 'assets/pwa/source-icon.png');

// Icon configurations
const icons = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-192-maskable.png', size: 192, maskable: true },
  { name: 'icon-512-maskable.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false, outputDir: 'public' },
];

async function generateIcon(config) {
  const { name, size, maskable, outputDir = 'public/icons' } = config;
  const outputPath = join(projectRoot, outputDir, name);
  
  try {
    // Read source image metadata
    const metadata = await sharp(SOURCE_IMAGE).metadata();
    console.log(`Source image: ${metadata.width}x${metadata.height}`);
    
    // Calculate padding for maskable icons (20% safe zone on each side = 40% total, so content is 60%)
    // For regular icons, use 10% padding for better appearance
    const paddingPercent = maskable ? 0.20 : 0.10;
    const contentSize = Math.round(size * (1 - 2 * paddingPercent));
    
    // Process image: resize to content size, then extend with padding
    let image = sharp(SOURCE_IMAGE);
    
    // Resize maintaining aspect ratio to fit within content size
    image = image.resize(contentSize, contentSize, {
      fit: 'inside',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    });
    
    // Get resized dimensions
    const resized = await image.toBuffer({ resolveWithObject: true });
    const { width: resizedWidth, height: resizedHeight } = resized.info;
    
    // Calculate how much to extend to reach final size
    const horizontalPadding = Math.round((size - resizedWidth) / 2);
    const verticalPadding = Math.round((size - resizedHeight) / 2);
    
    // Create final image with padding
    await sharp(resized.data)
      .extend({
        top: verticalPadding,
        bottom: size - resizedHeight - verticalPadding,
        left: horizontalPadding,
        right: size - resizedWidth - horizontalPadding,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated ${name} (${size}x${size}${maskable ? ', maskable' : ''})`);
  } catch (error) {
    console.error(`✗ Failed to generate ${name}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('Generating PWA icons from source image...\n');
  
  for (const iconConfig of icons) {
    await generateIcon(iconConfig);
  }
  
  console.log('\n✓ All icons generated successfully!');
  console.log('\nGenerated files:');
  console.log('  - public/icons/icon-192.png');
  console.log('  - public/icons/icon-512.png');
  console.log('  - public/icons/icon-192-maskable.png');
  console.log('  - public/icons/icon-512-maskable.png');
  console.log('  - public/apple-touch-icon.png');
}

main().catch(error => {
  console.error('Error generating icons:', error);
  process.exit(1);
});
