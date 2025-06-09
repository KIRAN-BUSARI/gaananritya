#!/usr/bin/env node

/**
 * Simple image optimization validator for Gaananritya client
 */

import { promises as fs } from 'fs';
import path from 'path';

const assetsDir = './src/assets';

async function findImages(dir) {
  const images = [];

  async function traverse(currentDir) {
    const items = await fs.readdir(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        await traverse(fullPath);
      } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(item)) {
        images.push(fullPath);
      }
    }
  }

  await traverse(dir);
  return images;
}

async function analyzeImages() {
  console.log('🔍 Analyzing images in assets folder...\n');

  try {
    const images = await findImages(assetsDir);

    if (images.length === 0) {
      console.log('No images found.');
      return;
    }

    console.log(`Found ${images.length} images:\n`);

    const stats = {
      webp: 0,
      jpg: 0,
      png: 0,
      other: 0,
      total: 0
    };

    for (const imagePath of images) {
      const ext = path.extname(imagePath).toLowerCase();
      const relativePath = path.relative(process.cwd(), imagePath);

      switch (ext) {
        case '.webp':
          stats.webp++;
          console.log(`✅ ${relativePath} (WebP - optimized)`);
          break;
        case '.jpg':
        case '.jpeg':
          stats.jpg++;
          console.log(`⚠️  ${relativePath} (JPEG - could be optimized to WebP)`);
          break;
        case '.png':
          stats.png++;
          console.log(`⚠️  ${relativePath} (PNG - could be optimized to WebP)`);
          break;
        default:
          stats.other++;
          console.log(`ℹ️  ${relativePath} (${ext} - other format)`);
      }
      stats.total++;
    }

    console.log('\n📊 Summary:');
    console.log(`  Total images: ${stats.total}`);
    console.log(`  WebP (optimized): ${stats.webp}`);
    console.log(`  JPEG: ${stats.jpg}`);
    console.log(`  PNG: ${stats.png}`);
    console.log(`  Other: ${stats.other}`);

    const optimizationPercentage = Math.round((stats.webp / stats.total) * 100);
    console.log(`  Optimization: ${optimizationPercentage}%`);

    if (optimizationPercentage === 100) {
      console.log('\n🎉 All images are already optimized as WebP!');
    } else {
      console.log(`\n💡 Consider converting ${stats.jpg + stats.png} images to WebP for better performance.`);
    }

  } catch (error) {
    console.error('❌ Error analyzing images:', error);
  }
}

// Run the analysis
analyzeImages();
