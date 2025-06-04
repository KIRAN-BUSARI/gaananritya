import { Plugin } from 'vite';

interface ImageOptimizationOptions {
  quality?: number;
  formats?: ('webp' | 'avif' | 'original')[];
  sizes?: number[];
  exclude?: RegExp[];
  outputDir?: string;
}

/**
 * Vite plugin for automatic image optimization
 */
export function imageOptimization(
  options: ImageOptimizationOptions = {},
): Plugin {
  const {
    quality = 80,
    formats = ['webp', 'original'],
    sizes = [320, 640, 768, 1024, 1280, 1920],
    exclude = [],
  } = options;

  return {
    name: 'image-optimization',
    apply: 'build',

    async generateBundle(
      _outputOptions: unknown,
      bundle: Record<string, unknown>,
    ) {
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
        `🖼️  Found ${Object.keys(imageAssets).length} images to optimize`,
      );

      // Process each image
      for (const [fileName] of Object.entries(imageAssets)) {
        try {
          // This would require sharp or similar library
          // For now, we'll log what would be optimized
          console.log(`Would optimize: ${fileName}`);
          console.log(`  Formats: ${formats.join(', ')}`);
          console.log(`  Sizes: ${sizes.join(', ')}`);
          console.log(`  Quality: ${quality}`);
        } catch (error) {
          console.warn(`Failed to optimize ${fileName}:`, error);
        }
      }
    },
  };
}

export default imageOptimization;
