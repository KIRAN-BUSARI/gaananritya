import { Plugin } from 'vite';
import sharp from 'sharp';
import path from 'path';

interface ImageOptimizationOptions {
  quality?: number;
  formats?: ('webp' | 'avif' | 'original')[];
  sizes?: number[];
  exclude?: RegExp[];
  outputDir?: string;
}

/**
 * Enhanced Vite plugin for automatic image optimization
 */
export function imageOptimization(
  options: ImageOptimizationOptions = {},
): Plugin {
  const {
    quality = 80,
    formats = ['webp', 'original'],
    sizes = [320, 640, 768, 1024, 1280, 1920],
    exclude = [],
    outputDir = 'optimized',
  } = options;

  return {
    name: 'vite-image-optimization',
    apply: 'build',

    configResolved(_config) {
      // Ensure sharp is available for image processing
      if (!sharp) {
        console.warn(
          'Sharp not available. Install with: npm install --save-dev sharp',
        );
      }
    },

    async generateBundle(_outputOptions, bundle) {
      if (!sharp) return;

      const imageAssets: { [key: string]: any } = {};

      // Find all image assets
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (
          asset &&
          typeof asset === 'object' &&
          'type' in asset &&
          asset.type === 'asset' &&
          /\.(png|jpe?g|gif)$/i.test(fileName) &&
          !exclude.some((pattern) => pattern.test(fileName))
        ) {
          imageAssets[fileName] = asset;
        }
      }

      console.log(
        `🖼️  Optimizing ${Object.keys(imageAssets).length} images...`,
      );

      // Process each image
      for (const [fileName, asset] of Object.entries(imageAssets)) {
        try {
          const source = asset.source as Buffer;
          const { name, ext } = path.parse(fileName);

          // Create optimized versions
          for (const format of formats) {
            for (const size of sizes) {
              const outputName = `${outputDir}/${name}-${size}w.${format === 'original' ? ext.slice(1) : format}`;

              let pipeline = sharp(source).resize(size, null, {
                withoutEnlargement: true,
                fit: 'inside',
              });

              if (format === 'webp') {
                pipeline = pipeline.webp({ quality });
              } else if (format === 'avif') {
                pipeline = pipeline.avif({ quality });
              } else {
                pipeline = pipeline.jpeg({ quality });
              }

              const optimizedBuffer = await pipeline.toBuffer();

              // Add to bundle
              this.emitFile({
                type: 'asset',
                fileName: outputName,
                source: optimizedBuffer,
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to optimize ${fileName}:`, error);
        }
      }
    },
  };
}

export default imageOptimization;
