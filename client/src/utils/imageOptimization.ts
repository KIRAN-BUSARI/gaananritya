// Image optimization utilities for performance
export const getOptimizedImageUrl = (url: string): string => {
  // If using a CDN like Cloudinary, you can add transformations here
  // For now, return the original URL
  return url;
};

// WebP support detection
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Image format optimization
export const getOptimizedFormat = (originalUrl: string): string => {
  if (supportsWebP() && !originalUrl.includes('.svg')) {
    // Convert to WebP if supported (would need server-side support)
    return originalUrl;
  }
  return originalUrl;
};

// Preload critical images
export const preloadImage = (
  src: string,
  priority: boolean = false,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    if (priority && 'fetchPriority' in img) {
      (img as any).fetchPriority = 'high';
    }

    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// Batch image preloader with concurrency control
export const preloadImages = async (
  urls: string[],
  maxConcurrent: number = 3,
  priorityCount: number = 1,
): Promise<void> => {
  const chunks: string[][] = [];

  for (let i = 0; i < urls.length; i += maxConcurrent) {
    chunks.push(urls.slice(i, i + maxConcurrent));
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isPriorityChunk = i === 0;

    const promises = chunk.map((url, index) => {
      const isPriority = isPriorityChunk && index < priorityCount;
      return preloadImage(url, isPriority).catch(() => {
        console.warn(`Failed to preload image: ${url}`);
      });
    });

    await Promise.allSettled(promises);

    // Add small delay between chunks to prevent overwhelming the browser
    if (i < chunks.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

// Responsive image source set generation
export const generateSrcSet = (baseUrl: string, sizes: number[]): string => {
  return sizes
    .map((size) => `${getOptimizedImageUrl(baseUrl)} ${size}w`)
    .join(', ');
};

// Calculate optimal image dimensions based on container
export const getOptimalImageSize = (
  containerWidth: number,
  devicePixelRatio: number = window.devicePixelRatio || 1,
): number => {
  const targetWidth = containerWidth * devicePixelRatio;

  // Common breakpoints
  const breakpoints = [320, 640, 768, 1024, 1280, 1920, 2560];

  // Find the smallest breakpoint that's larger than or equal to target width
  const optimalSize =
    breakpoints.find((bp) => bp >= targetWidth) ||
    breakpoints[breakpoints.length - 1];

  return optimalSize;
};
