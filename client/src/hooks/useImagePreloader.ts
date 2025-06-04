import { useState, useEffect, useCallback } from 'react';

interface UseImagePreloaderOptions {
  images: string[];
  priority?: boolean;
  maxConcurrent?: number;
  isInView?: boolean;
}

interface ImageLoadState {
  loaded: Set<number>;
  loading: Set<number>;
  failed: Set<number>;
  isFirstImageLoaded: boolean;
}

export const useImagePreloader = ({
  images,
  priority = true,
  maxConcurrent = 3,
  isInView = true,
}: UseImagePreloaderOptions) => {
  const [state, setState] = useState<ImageLoadState>({
    loaded: new Set(),
    loading: new Set(),
    failed: new Set(),
    isFirstImageLoaded: false,
  });

  const loadImage = useCallback(
    (src: string, index: number, isPriority = false): Promise<void> => {
      return new Promise((resolve) => {
        // Check if already loaded or loading
        if (state.loaded.has(index) || state.loading.has(index)) {
          resolve();
          return;
        }

        setState((prev) => ({
          ...prev,
          loading: new Set(prev.loading).add(index),
        }));

        const img = new Image();

        if (isPriority) {
          (img as any).fetchPriority = 'high';
          (img as any).loading = 'eager';
        } else {
          (img as any).loading = 'lazy';
        }

        img.onload = () => {
          setState((prev) => {
            const newLoaded = new Set(prev.loaded).add(index);
            const newLoading = new Set(prev.loading);
            newLoading.delete(index);

            return {
              ...prev,
              loaded: newLoaded,
              loading: newLoading,
              isFirstImageLoaded: prev.isFirstImageLoaded || index === 0,
            };
          });
          resolve();
        };

        img.onerror = () => {
          setState((prev) => {
            const newFailed = new Set(prev.failed).add(index);
            const newLoading = new Set(prev.loading);
            newLoading.delete(index);

            return {
              ...prev,
              failed: newFailed,
              loading: newLoading,
            };
          });
          resolve();
        };

        img.src = src;
      });
    },
    [state.loaded, state.loading],
  );

  useEffect(() => {
    if (images.length === 0 || !isInView) return;

    const loadImages = async () => {
      // Load first image with high priority
      if (priority && images[0]) {
        await loadImage(images[0], 0, true);
      }

      // Load next few images
      const initialBatch = images.slice(priority ? 1 : 0, maxConcurrent);
      const promises = initialBatch.map((src, idx) =>
        loadImage(src, priority ? idx + 1 : idx, false),
      );
      await Promise.allSettled(promises);

      // Load remaining images gradually
      if (images.length > maxConcurrent) {
        setTimeout(() => {
          const remainingImages = images.slice(maxConcurrent);
          const remainingPromises = remainingImages.map((src, idx) =>
            loadImage(src, idx + maxConcurrent, false),
          );
          Promise.allSettled(remainingPromises);
        }, 1000);
      }
    };

    loadImages();
  }, [images, priority, maxConcurrent, isInView, loadImage]);

  return {
    loadedImages: state.loaded,
    loadingImages: state.loading,
    failedImages: state.failed,
    isFirstImageLoaded: state.isFirstImageLoaded,
    isImageLoaded: (index: number) => state.loaded.has(index),
    isImageLoading: (index: number) => state.loading.has(index),
    isImageFailed: (index: number) => state.failed.has(index),
  };
};
