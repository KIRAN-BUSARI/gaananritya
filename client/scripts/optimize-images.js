#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script optimizes images in the assets folder by:
 * 1. Converting to WebP format
 * 2. Generating multiple sizes for responsive images
 * 3. Compressing existing formats
 * 
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/optimized');

// Image optimization settings
const QUALITY_SETTINGS = {
  webp: { quality: 80 },
  jpeg: { quality: 85, mozjpeg: true },
  png: { quality: 90, compressionLevel: 9 }
};

// Responsive breakpoints
const BREAKPOINTS = [320, 640, 768, 1024, 1280, 1920];

/**
 * Get all image files from assets directory
 */
async function getImageFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const subFiles = await getImageFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile() && /\.(png|jpe?g)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Create optimized versions of an image
 */
async function optimizeImage(inputPath) {
  const relativePath = path.relative(ASSETS_DIR, inputPath);
  const { dir, name, ext } = path.parse(relativePath);
  const outputDir = path.join(OUTPUT_DIR, dir);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  console.log(`Optimizing: ${relativePath}`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Skip if image is already small
    if (metadata.width <= 320) {
      console.log(`  Skipping ${name}${ext} (already small)`);
      return;
    }

    // Generate WebP versions at different sizes
    for (const width of BREAKPOINTS) {
      if (width < metadata.width) {
        const webpPath = path.join(outputDir, `${name}-${width}w.webp`);
        await image
          .resize(width, null, { withoutEnlargement: true })
          .webp(QUALITY_SETTINGS.webp)
          .toFile(webpPath);

        console.log(`  Created: ${path.basename(webpPath)}`);
      }
    }

    // Create full-size WebP
    const fullWebpPath = path.join(outputDir, `${name}.webp`);
    await image
      .webp(QUALITY_SETTINGS.webp)
      .toFile(fullWebpPath);

    console.log(`  Created: ${path.basename(fullWebpPath)}`);

    // Create optimized original format
    const optimizedPath = path.join(outputDir, `${name}${ext}`);
    const format = ext.toLowerCase() === '.png' ? 'png' : 'jpeg';

    await image
    [format](QUALITY_SETTINGS[format])
      .toFile(optimizedPath);

    console.log(`  Created: ${path.basename(optimizedPath)}`);

    // Calculate size reduction
    const originalStats = await fs.stat(inputPath);
    const optimizedStats = await fs.stat(optimizedPath);
    const reduction = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);

    console.log(`  Size reduction: ${reduction}%`);

  } catch (error) {
    console.error(`  Error optimizing ${relativePath}:`, error.message);
  }
}

/**
 * Generate TypeScript module with optimized image imports
 */
async function generateImportModule() {
  const optimizedFiles = await getImageFiles(OUTPUT_DIR);
  const imports = [];
  const exports = [];

  for (const file of optimizedFiles) {
    const relativePath = path.relative(OUTPUT_DIR, file);
    const { dir, name } = path.parse(relativePath);
    const importName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const importPath = `./optimized/${relativePath}`.replace(/\\/g, '/');

    imports.push(`import ${importName} from '${importPath}';`);
    exports.push(`  '${relativePath}': ${importName},`);
  }

  const moduleContent = `// Auto-generated optimized image imports
${imports.join('\n')}

export const optimizedImages = {
${exports.join('\n')}
};

export default optimizedImages;
`;

  await fs.writeFile(path.join(ASSETS_DIR, 'optimized-images.ts'), moduleContent);
  console.log('Generated optimized-images.ts module');
}

/**
 * Main optimization function
 */
async function main() {
  console.log('Starting image optimization...');
  console.log(`Input directory: ${ASSETS_DIR}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);

  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Get all images
    const imageFiles = await getImageFiles(ASSETS_DIR);
    console.log(`Found ${imageFiles.length} images to optimize`);

    // Optimize each image
    for (const imageFile of imageFiles) {
      await optimizeImage(imageFile);
    }

    // Generate import module
    await generateImportModule();

    console.log('\n✅ Image optimization complete!');
    console.log('\nNext steps:');
    console.log('1. Update your components to use optimized images');
    console.log('2. Implement responsive image loading');
    console.log('3. Set up WebP fallbacks for older browsers');

  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

// Check if sharp is available
try {
  require.resolve('sharp');
} catch (error) {
  console.error('❌ Sharp is required for image optimization');
  console.error('Install it with: npm install --save-dev sharp');
  process.exit(1);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { optimizeImage, getImageFiles };
