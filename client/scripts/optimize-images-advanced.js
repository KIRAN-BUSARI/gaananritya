import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../src/assets');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');

// Define responsive breakpoints
const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1200,
  xl: 1920
};

// Quality settings for different formats
const QUALITY_SETTINGS = {
  webp: 85,
  jpeg: 80,
  png: 90
};

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function getImageDimensions(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.error(`Error getting dimensions for ${imagePath}:`, error.message);
    return null;
  }
}

async function optimizeImage(inputPath, filename) {
  console.log(`Processing: ${filename}`);

  const { width, height } = await getImageDimensions(inputPath);
  if (!width || !height) {
    console.log(`Skipping ${filename} - unable to get dimensions`);
    return;
  }

  const nameWithoutExt = path.parse(filename).name;
  const outputSubDir = path.join(OUTPUT_DIR, nameWithoutExt);
  await ensureDirectoryExists(outputSubDir);

  // Generate responsive variants
  const variants = [];

  for (const [breakpointName, breakpointWidth] of Object.entries(BREAKPOINTS)) {
    if (width > breakpointWidth) {
      variants.push({
        name: breakpointName,
        width: breakpointWidth,
        height: Math.round((height * breakpointWidth) / width)
      });
    }
  }

  // Always include original size
  variants.push({
    name: 'original',
    width: width,
    height: height
  });

  // Process each variant
  for (const variant of variants) {
    const baseOutputPath = path.join(outputSubDir, `${nameWithoutExt}-${variant.name}`);

    const sharpInstance = sharp(inputPath)
      .resize(variant.width, variant.height, {
        fit: 'cover',
        position: 'center'
      });

    // Generate WebP version (highest priority)
    await sharpInstance
      .clone()
      .webp({ quality: QUALITY_SETTINGS.webp, effort: 6 })
      .toFile(`${baseOutputPath}.webp`);

    // Generate JPEG fallback
    await sharpInstance
      .clone()
      .jpeg({ quality: QUALITY_SETTINGS.jpeg, progressive: true })
      .toFile(`${baseOutputPath}.jpg`);

    console.log(`  ✓ Generated ${variant.name} variant (${variant.width}x${variant.height})`);
  }

  // Generate metadata file
  const metadataPath = path.join(outputSubDir, 'metadata.json');
  const metadata = {
    original: { width, height },
    variants: variants.map(v => ({
      name: v.name,
      width: v.width,
      height: v.height,
      webp: `${nameWithoutExt}-${v.name}.webp`,
      jpg: `${nameWithoutExt}-${v.name}.jpg`
    })),
    generatedAt: new Date().toISOString()
  };

  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`  ✓ Generated metadata file`);
}

async function processAllImages() {
  try {
    console.log('🚀 Starting advanced image optimization...\n');

    await ensureDirectoryExists(OUTPUT_DIR);

    const files = await fs.readdir(INPUT_DIR);
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.log('No image files found in the input directory.');
      return;
    }

    console.log(`Found ${imageFiles.length} image(s) to optimize:\n`);

    for (const filename of imageFiles) {
      const inputPath = path.join(INPUT_DIR, filename);
      await optimizeImage(inputPath, filename);
      console.log(''); // Add spacing between files
    }

    console.log('✅ All images optimized successfully!');
    console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);

    // Generate index file for easy import
    await generateImageIndex();

  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

async function generateImageIndex() {
  const indexPath = path.join(OUTPUT_DIR, 'index.js');
  let indexContent = '// Auto-generated image index\n\n';

  const subdirs = await fs.readdir(OUTPUT_DIR);
  const imageDirs = (await Promise.all(
    subdirs.map(async (dir) => {
      const dirPath = path.join(OUTPUT_DIR, dir);
      const stat = await fs.stat(dirPath);
      return stat.isDirectory() ? dir : null;
    })
  )).filter(Boolean);

  for (const imageDir of imageDirs) {
    const metadataPath = path.join(OUTPUT_DIR, imageDir, 'metadata.json');
    try {
      const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));

      indexContent += `export const ${imageDir} = {\n`;
      indexContent += `  original: { width: ${metadata.original.width}, height: ${metadata.original.height} },\n`;
      indexContent += `  variants: {\n`;

      for (const variant of metadata.variants) {
        indexContent += `    ${variant.name}: {\n`;
        indexContent += `      width: ${variant.width},\n`;
        indexContent += `      height: ${variant.height},\n`;
        indexContent += `      webp: '/images/optimized/${imageDir}/${variant.webp}',\n`;
        indexContent += `      jpg: '/images/optimized/${imageDir}/${variant.jpg}'\n`;
        indexContent += `    },\n`;
      }

      indexContent += `  }\n`;
      indexContent += `};\n\n`;
    } catch (error) {
      console.warn(`Warning: Could not read metadata for ${imageDir}`);
    }
  }

  await fs.writeFile(indexPath, indexContent);
  console.log('✅ Generated image index file');
}

// Run the optimization
processAllImages();

export { processAllImages, optimizeImage };
