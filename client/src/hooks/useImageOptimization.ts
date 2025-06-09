// Enhanced image optimization utilities for performance
import { useMemo, useCallback } from 'react';

interface ImageOptimizationConfig {
  quality?: number;
  format?: 'webp' | 'jpg' | 'auto';
  sizes?: number[];
  enableLazyLoading?: boolean;
  enablePreloading?: boolean;
  enableCriticalImageOptimization?: boolean;
}

export const useImageOptimization = (config: ImageOptimizationConfig = {}) => {
  const {
    quality = 80,
    format = 'auto',
    sizes = [320, 640, 768, 1024, 1280, 1920],
    enableLazyLoading = true,
    enablePreloading = true,
    // enableCriticalImageOptimization = true, // TODO: Implement critical image optimization
  } = config;

  // WebP support detection with caching
  const supportsWebP = useMemo(() => {
    if (typeof window === 'undefined') return false;

    // Check if we've already determined WebP support
    const cached = sessionStorage.getItem('webp-support');
    if (cached !== null) {
      return cached === 'true';
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const isSupported =
      canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    sessionStorage.setItem('webp-support', isSupported.toString());
    return isSupported;
  }, []);

  // Get optimized image URL
  const getOptimizedImageUrl = useCallback(
    (
      originalUrl: string,
      width?: number,
      height?: number,
      customFormat?: 'webp' | 'jpg',
    ): string => {
      if (!originalUrl) return '';

      // For static assets, check if we have optimized versions
      const isStaticAsset =
        originalUrl.startsWith('/') || originalUrl.includes('/assets/');

      if (isStaticAsset) {
        const useWebP =
          customFormat === 'webp' || (format === 'auto' && supportsWebP);
        const extension = useWebP ? 'webp' : 'jpg';

        // Try to get the optimized version based on width
        if (width) {
          const optimalSize = getOptimalSize(width);
          const baseName = originalUrl.split('.')[0];
          const optimizedUrl = `${baseName}-${optimalSize}w.${extension}`;
          return optimizedUrl;
        }
      }

      // For external URLs or CDN integration, add query parameters
      const url = new URL(originalUrl, window.location.origin);

      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      if (quality !== 80) url.searchParams.set('q', quality.toString());

      const useWebP =
        customFormat === 'webp' || (format === 'auto' && supportsWebP);
      if (useWebP) url.searchParams.set('f', 'webp');

      return url.toString();
    },
    [format, quality, supportsWebP],
  );

  // Get optimal size from available sizes
  const getOptimalSize = useCallback(
    (targetWidth: number): number => {
      return (
        sizes.find((size) => size >= targetWidth) || sizes[sizes.length - 1]
      );
    },
    [sizes],
  );

  // Generate responsive srcSet
  const generateSrcSet = useCallback(
    (originalUrl: string, maxWidth?: number): string => {
      const relevantSizes = maxWidth
        ? sizes.filter((size) => size <= maxWidth * 2) // Don't generate larger than 2x
        : sizes;

      return relevantSizes
        .map((size) => `${getOptimizedImageUrl(originalUrl, size)} ${size}w`)
        .join(', ');
    },
    [sizes, getOptimizedImageUrl],
  );

  // Preload critical images
  const preloadImage = useCallback(
    (
      src: string,
      priority: boolean = false,
      width?: number,
      height?: number,
    ): Promise<void> => {
      if (!enablePreloading) return Promise.resolve();

      return new Promise((resolve, reject) => {
        const img = new Image();

        // Set loading priority
        if (priority) {
          (img as any).fetchPriority = 'high';
          (img as any).loading = 'eager';
        } else {
          (img as any).loading = 'lazy';
        }

        // Set dimensions for better layout stability
        if (width) img.width = width;
        if (height) img.height = height;

        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to preload: ${src}`));

        img.src = getOptimizedImageUrl(src, width, height);
      });
    },
    [enablePreloading, getOptimizedImageUrl],
  );

  // Batch preload images with concurrency control
  const preloadImages = useCallback(
    async (
      imageUrls: string[],
      maxConcurrent: number = 2,
      priorityCount: number = 1,
    ): Promise<void> => {
      if (!enablePreloading) return;

      const batches: string[][] = [];
      for (let i = 0; i < imageUrls.length; i += maxConcurrent) {
        batches.push(imageUrls.slice(i, i + maxConcurrent));
      }

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const isPriorityBatch = i === 0;

        const promises = batch.map((url, index) => {
          const isPriority = isPriorityBatch && index < priorityCount;
          return preloadImage(url, isPriority).catch(() => {
            console.warn(`Failed to preload: ${url}`);
          });
        });

        await Promise.allSettled(promises);

        // Add delay between batches to prevent overwhelming the browser
        if (i < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    },
    [enablePreloading, preloadImage],
  );

  // Create picture element sources
  const createPictureSources = useCallback(
    (originalUrl: string, sizes?: string, maxWidth?: number) => {
      const sources = [];

      // WebP source
      if (supportsWebP) {
        sources.push({
          srcSet: generateSrcSet(
            getOptimizedImageUrl(originalUrl, undefined, undefined, 'webp'),
            maxWidth,
          ),
          type: 'image/webp',
          sizes,
        });
      }

      // Fallback source
      sources.push({
        srcSet: generateSrcSet(
          getOptimizedImageUrl(originalUrl, undefined, undefined, 'jpg'),
          maxWidth,
        ),
        type: 'image/jpeg',
        sizes,
      });

      return sources;
    },
    [supportsWebP, generateSrcSet, getOptimizedImageUrl],
  );

  // Get responsive image props
  const getResponsiveImageProps = useCallback(
    (
      src: string,
      options: {
        width?: number;
        height?: number;
        sizes?: string;
        priority?: boolean;
        lazy?: boolean;
      } = {},
    ) => {
      const {
        width,
        height,
        sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        priority = false,
        lazy = enableLazyLoading,
      } = options;

      return {
        src: getOptimizedImageUrl(src, width, height),
        srcSet: generateSrcSet(src, width),
        sizes,
        loading: lazy && !priority ? ('lazy' as const) : ('eager' as const),
        decoding: 'async' as const,
        fetchPriority: priority ? ('high' as const) : ('auto' as const),
        width,
        height,
      };
    },
    [enableLazyLoading, getOptimizedImageUrl, generateSrcSet],
  );

  return {
    supportsWebP,
    getOptimizedImageUrl,
    generateSrcSet,
    preloadImage,
    preloadImages,
    createPictureSources,
    getResponsiveImageProps,
    getOptimalSize,
  };
};

// Utility function for image dimensions
export const calculateAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
};

// Utility function for blur placeholder generation
export const generateBlurDataURL = (
  width: number = 10,
  height: number = 10,
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Create a simple gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.1);
};

export default useImageOptimization;
