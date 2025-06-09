#!/usr/bin/env node

/**
 * Performance optimization script for the Gaananritya client
 * This script optimizes images for web delivery
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import globPkg from 'glob';
import { fileURLToPath } from 'url';

const { glob } = globPkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  inputDir: './src/assets',
  outputDir: './public/images/optimized',
  formats: ['webp', 'jpg'],
  qualities: { webp: 80, jpg: 85 },
  sizes: [320, 640, 768, 1024, 1280, 1920],
};

// Ensure output directory exists
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

// Get image info
async function getImageInfo(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
    };
  } catch (error) {
    console.warn(`Failed to get metadata for ${imagePath}:`, error.message);
    return null;
  }
}

// Optimize single image
async function optimizeImage(inputPath, outputDir, basename) {
  console.log(`📸 Processing: ${basename}`);

  const info = await getImageInfo(inputPath);
  if (!info) return null;

  const originalWidth = info.width;
  const originalHeight = info.height;

  // Create size variants
  for (const targetWidth of CONFIG.sizes) {
    if (targetWidth > originalWidth) continue; // Don't upscale

    const targetHeight = Math.round((originalHeight * targetWidth) / originalWidth);

    // Generate formats for this size
    for (const format of CONFIG.formats) {
      const extension = format === 'webp' ? 'webp' : 'jpg';
      const quality = CONFIG.qualities[format];
      const filename = `${basename}-${targetWidth}w.${extension}`;
      const outputPath = path.join(outputDir, filename);

      try {
        let pipeline = sharp(inputPath).resize(targetWidth, targetHeight, {
          fit: 'cover',
          position: 'center',
        });

        if (format === 'webp') {
          pipeline = pipeline.webp({ quality });
        } else {
          pipeline = pipeline.jpeg({ quality, progressive: true });
        }

        await pipeline.toFile(outputPath);
        console.log(`   ✓ ${filename} (${format.toUpperCase()})`);
      } catch (error) {
        console.error(`   ✗ Failed to create ${filename}:`, error.message);
      }
    }
  }

  return { width: originalWidth, height: originalHeight };
}

// Process all images
async function processImages() {
  console.log('🖼️  Starting image optimization...\n');

  try {
    // Find all images
    const imagePattern = path.join(CONFIG.inputDir, '**/*.{jpg,jpeg,png,webp}');
    const imagePaths = await globPkg.glob(imagePattern);

    if (!imagePaths || imagePaths.length === 0) {
      console.log('No images found to optimize.');
      return;
    }

    console.log(`Found ${imagePaths.length} images to optimize.\n`);

    // Process each image
    for (const imagePath of imagePaths) {
      const relativePath = path.relative(CONFIG.inputDir, imagePath);
      const { dir, name } = path.parse(relativePath);
      const outputDir = path.join(CONFIG.outputDir, dir || 'root');

      await ensureDir(outputDir);
      await optimizeImage(imagePath, outputDir, name);
    }

    console.log('\n✅ Image optimization completed!');
  } catch (error) {
    console.error('❌ Image optimization failed:', error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting performance optimization...\n');
  await processImages();
  console.log('\n🎉 All optimizations completed successfully!');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
