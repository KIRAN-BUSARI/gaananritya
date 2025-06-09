#!/usr/bin/env node

/**
 * Performance optimization script for the Gaananritya client
 * This script optimizes images, generates critical CSS, and creates service worker
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  inputDir: './src/assets',
  outputDir: './public/images/optimized',
  formats: ['webp', 'jpg'],
  qualities: { webp: 80, jpg: 85 },
  sizes: [320, 640, 768, 1024, 1280, 1920],
  generateMetadata: true,
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

  const variants = {};
  const originalWidth = info.width;
  const originalHeight = info.height;

  // Create size variants
  for (const targetWidth of CONFIG.sizes) {
    if (targetWidth > originalWidth) continue; // Don't upscale

    const targetHeight = Math.round((originalHeight * targetWidth) / originalWidth);
    const sizeKey = getSizeKey(targetWidth);

    variants[sizeKey] = {
      width: targetWidth,
      height: targetHeight,
      webp: '',
      jpg: '',
    };

    // Generate formats
    for (const format of CONFIG.formats) {
      const extension = format === 'webp' ? 'webp' : 'jpg';
      const quality = CONFIG.qualities[format];
      const filename = `${basename}-${sizeKey}.${extension}`;
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
        variants[sizeKey][format] = `/images/optimized/${path.basename(outputDir)}/${filename}`;

        console.log(`   ✓ ${filename} (${format.toUpperCase()})`);
      } catch (error) {
        console.error(`   ✗ Failed to create ${filename}:`, error.message);
      }
    }
  }

  // Add original size variant
  const originalKey = 'original';
  variants[originalKey] = {
    width: originalWidth,
    height: originalHeight,
    webp: '',
    jpg: '',
  };

  for (const format of CONFIG.formats) {
    const extension = format === 'webp' ? 'webp' : 'jpg';
    const quality = CONFIG.qualities[format];
    const filename = `${basename}-${originalKey}.${extension}`;
    const outputPath = path.join(outputDir, filename);

    try {
      let pipeline = sharp(inputPath);

      if (format === 'webp') {
        pipeline = pipeline.webp({ quality });
      } else {
        pipeline = pipeline.jpeg({ quality, progressive: true });
      }

      await pipeline.toFile(outputPath);
      variants[originalKey][format] = `/images/optimized/${path.basename(outputDir)}/${filename}`;
    } catch (error) {
      console.error(`   ✗ Failed to create original ${filename}:`, error.message);
    }
  }

  return {
    original: { width: originalWidth, height: originalHeight },
    variants,
  };
}

// Get size key from width
function getSizeKey(width) {
  if (width <= 480) return 'mobile';
  if (width <= 768) return 'tablet';
  if (width <= 1200) return 'desktop';
  if (width <= 1920) return 'xl';
  return 'xxl';
}

// Process all images
async function processImages() {
  console.log('🖼️  Starting image optimization...\n');

  try {
    // Find all images
    const imagePattern = path.join(CONFIG.inputDir, '**/*.{jpg,jpeg,png,webp}');
    const imagePaths = await glob(imagePattern);

    if (imagePaths.length === 0) {
      console.log('No images found to optimize.');
      return;
    }

    console.log(`Found ${imagePaths.length} images to optimize.\n`);

    const metadata = {};

    // Process each image
    for (const imagePath of imagePaths) {
      const relativePath = path.relative(CONFIG.inputDir, imagePath);
      const { dir, name } = path.parse(relativePath);
      const outputDir = path.join(CONFIG.outputDir, dir || name);

      await ensureDir(outputDir);

      const optimizedData = await optimizeImage(imagePath, outputDir, name);
      if (optimizedData && CONFIG.generateMetadata) {
        metadata[name] = optimizedData;
      }
    }

    // Generate metadata file
    if (CONFIG.generateMetadata && Object.keys(metadata).length > 0) {
      await generateMetadataFile(metadata);
    }

    console.log('\n✅ Image optimization completed!');
  } catch (error) {
    console.error('❌ Image optimization failed:', error);
    process.exit(1);
  }
}

// Generate TypeScript metadata file
async function generateMetadataFile(metadata) {
  console.log('\n📝 Generating metadata file...');

  const metadataTs = `// Auto-generated optimized image metadata
export interface ImageVariant {
  width: number;
  height: number;
  webp: string;
  jpg: string;
}

export interface OptimizedImageMeta {
  original: { width: number; height: number };
  variants: {
    mobile?: ImageVariant;
    tablet?: ImageVariant;
    desktop?: ImageVariant;
    xl?: ImageVariant;
    original: ImageVariant;
  };
}

${Object.entries(metadata)
      .map(([name, data]) => {
        const variableName = name.replace(/[^a-zA-Z0-9]/g, '');
        return `export const ${variableName}: OptimizedImageMeta = ${JSON.stringify(data, null, 2)};`;
      })
      .join('\n\n')}

// Helper function to get the best image variant based on viewport width
export function getBestImageVariant(
  imageMeta: OptimizedImageMeta,
  viewportWidth: number,
  supportsWebP: boolean = false,
): string {
  const { variants } = imageMeta;
  let selectedVariant: ImageVariant;

  if (viewportWidth <= 480 && variants.mobile) {
    selectedVariant = variants.mobile;
  } else if (viewportWidth <= 768 && variants.tablet) {
    selectedVariant = variants.tablet;
  } else if (viewportWidth <= 1200 && variants.desktop) {
    selectedVariant = variants.desktop;
  } else if (viewportWidth <= 1920 && variants.xl) {
    selectedVariant = variants.xl;
  } else {
    selectedVariant = variants.original;
  }

  return supportsWebP ? selectedVariant.webp : selectedVariant.jpg;
}

// Export all images for easy importing
export const optimizedImages = {
${Object.keys(metadata)
      .map(name => {
        const variableName = name.replace(/[^a-zA-Z0-9]/g, '');
        return `  ${variableName},`;
      })
      .join('\n')}
};
`;

  const outputPath = path.join('./src/utils', 'optimizedImagesGenerated.ts');
  await fs.writeFile(outputPath, metadataTs);
  console.log(`   ✓ Metadata written to ${outputPath}`);
}

// Performance audit
async function performanceAudit() {
  console.log('🔍 Running performance audit...\n');

  // Check bundle size
  try {
    const distPath = './dist';
    const stats = await fs.stat(distPath).catch(() => null);

    if (stats) {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      try {
        const { stdout } = await execAsync(`du -sh ${distPath}`);
        console.log(`📦 Bundle size: ${stdout.trim().split('\t')[0]}`);
      } catch (error) {
        console.log('📦 Bundle size: Unable to calculate');
      }
    }
  } catch (error) {
    console.log('📦 Bundle size: Not available (run build first)');
  }

  // Check image optimization
  const imageDir = CONFIG.outputDir;
  try {
    const optimizedImages = await glob(path.join(imageDir, '**/*.{webp,jpg}'));
    console.log(`🖼️  Optimized images: ${optimizedImages.length}`);
  } catch (error) {
    console.log('🖼️  Optimized images: 0');
  }

  console.log('\n✅ Performance audit completed!');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'optimize';

  switch (command) {
    case 'optimize':
    case 'images':
      await processImages();
      break;
    case 'audit':
      await performanceAudit();
      break;
    case 'all':
      await processImages();
      await performanceAudit();
      break;
    default:
      console.log(`
Usage: node scripts/optimize.js [command]

Commands:
  optimize, images  Optimize all images
  audit            Run performance audit
  all              Run optimization and audit

Examples:
  npm run optimize:images
  npm run audit:performance
      `);
      break;
  }
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
