import { cn } from '@/lib/utils';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
} from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface OptimizedCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
  priority?: boolean;
  lazy?: boolean;
  autoPlay?: boolean;
  maxPreload?: number;
}

const OptimizedCarousel: React.FC<OptimizedCarouselProps> = memo(
  ({
    images = [],
    className,
    interval = 5000,
    priority = true,
    lazy = false,
    autoPlay = true,
    maxPreload = 3,
  }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);
    const [isInView, setIsInView] = useState(!lazy);
    const [isPaused, setIsPaused] = useState(false);

    const preloadedImages = useRef<HTMLImageElement[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageIndexRef = useRef(currentImageIndex);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const { markStart, markEnd, measureImageLoad } =
      usePerformanceMonitor('OptimizedCarousel');

    // Keep ref in sync
    imageIndexRef.current = currentImageIndex;

    // Intersection observer for lazy loading
    useEffect(() => {
      if (!lazy || !containerRef.current) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        },
        {
          rootMargin: '100px',
          threshold: 0.1,
        },
      );

      observerRef.current.observe(containerRef.current);

      return () => observerRef.current?.disconnect();
    }, [lazy]);

    // Optimized visible images calculation
    const visibleImages = useMemo(() => {
      if (images.length <= 1)
        return images.map((url, index) => ({ url, index }));

      const current = currentImageIndex;
      const prev = (currentImageIndex - 1 + images.length) % images.length;
      const next = (currentImageIndex + 1) % images.length;

      return [prev, current, next].map((index) => ({
        url: images[index],
        index,
      }));
    }, [images, currentImageIndex]);

    // Optimized next image function
    const nextImage = useCallback(() => {
      if (images.length <= 1 || isPaused) return;

      markStart('image-transition');
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % images.length;
        imageIndexRef.current = newIndex;
        markEnd('image-transition');
        return newIndex;
      });
    }, [images.length, isPaused, markStart, markEnd]);

    // Enhanced timer management
    useEffect(() => {
      if (
        !autoPlay ||
        images.length <= 1 ||
        !isFirstImageLoaded ||
        !isInView ||
        isPaused
      )
        return;

      intervalRef.current = setInterval(nextImage, interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [
      autoPlay,
      images.length,
      interval,
      nextImage,
      isFirstImageLoaded,
      isInView,
      isPaused,
    ]);

    // Enhanced visibility change handling
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setIsPaused(true);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else if (
          autoPlay &&
          images.length > 1 &&
          isFirstImageLoaded &&
          isInView
        ) {
          setIsPaused(false);
        }
      };

      const handleMouseEnter = () => setIsPaused(true);
      const handleMouseLeave = () => setIsPaused(false);

      document.addEventListener('visibilitychange', handleVisibilityChange);
      const container = containerRef.current;

      if (container) {
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);
      }

      return () => {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
        );
        if (container) {
          container.removeEventListener('mouseenter', handleMouseEnter);
          container.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }, [autoPlay, images.length, isFirstImageLoaded, isInView]);

    // Enhanced image loading with performance monitoring
    useEffect(() => {
      if (images.length === 0 || !isInView) return;

      const loadImage = async (
        src: string,
        index: number,
        isPriority = false,
      ): Promise<void> => {
        if (loadedImages.has(index)) return;

        markStart(`image-load-${index}`);
        await measureImageLoad(src);
        markEnd(`image-load-${index}`);

        return new Promise((resolve) => {
          const img = new Image();

          if (isPriority) {
            (img as any).fetchPriority = 'high';
            (img as any).loading = 'eager';
          } else {
            (img as any).loading = 'lazy';
          }

          img.onload = () => {
            setLoadedImages((prev) => new Set(prev).add(index));
            if (index === 0) {
              setIsFirstImageLoaded(true);
            }
            resolve();
          };

          img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            resolve();
          };

          img.src = src;
          preloadedImages.current[index] = img;
        });
      };

      const loadImagesSequentially = async () => {
        // Load priority image first
        if (priority && images[0]) {
          await loadImage(images[0], 0, true);
        }

        // Load next few images
        const preloadCount = Math.min(maxPreload, images.length);
        const initialBatch = images.slice(priority ? 1 : 0, preloadCount);

        for (const [idx, src] of initialBatch.entries()) {
          const actualIndex = priority ? idx + 1 : idx;
          await loadImage(src, actualIndex, false);

          // Small delay to prevent blocking
          if (idx < initialBatch.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        }

        // Load remaining images after delay
        if (images.length > preloadCount) {
          setTimeout(async () => {
            const remainingImages = images.slice(preloadCount);
            for (const [idx, src] of remainingImages.entries()) {
              await loadImage(src, idx + preloadCount, false);
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          }, 1000);
        }
      };

      loadImagesSequentially();

      return () => {
        preloadedImages.current.forEach((img) => {
          if (img) {
            img.onload = null;
            img.onerror = null;
          }
        });
        preloadedImages.current = [];
      };
    }, [
      images,
      priority,
      isInView,
      maxPreload,
      measureImageLoad,
      markStart,
      markEnd,
      loadedImages,
    ]);

    // Loading state for lazy components
    if (lazy && !isInView) {
      return (
        <div
          ref={containerRef}
          className={cn(
            'relative flex w-full items-center justify-center overflow-hidden bg-gray-900',
            'h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[calc(100vh-100px)]',
            className,
          )}
        >
          <div className="text-lg text-gray-400">Loading...</div>
        </div>
      );
    }

    if (images.length === 0) {
      return <div className="text-center text-white">No images available</div>;
    }

    // Loading state for priority components
    if (priority && !isFirstImageLoaded) {
      return (
        <div
          ref={containerRef}
          className={cn(
            'relative flex w-full items-center justify-center overflow-hidden bg-black',
            'h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[calc(100vh-100px)]',
            className,
          )}
        >
          <div className="text-lg text-white">Loading...</div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={cn(
          'gpu-accelerated relative w-full overflow-hidden bg-black',
          'h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[calc(100vh-100px)]',
          className,
        )}
      >
        {visibleImages.map(({ url, index }) => {
          const isVisible = index === currentImageIndex;
          const isLoaded = loadedImages.has(index);

          return (
            <div
              key={`carousel-image-${index}`}
              aria-hidden={!isVisible}
              className={cn(
                'absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out',
                'carousel-item',
                isVisible ? 'active' : 'inactive',
              )}
              style={{
                backgroundImage: isLoaded ? `url(${url})` : 'none',
                opacity: isVisible && isLoaded ? 1 : 0,
                zIndex: isVisible ? 10 : 1,
              }}
            />
          );
        })}

        {/* Optimized preloading */}
        {images.length > 1 && isInView && (
          <>
            <link
              rel="prefetch"
              href={images[(currentImageIndex + 1) % images.length]}
              as="image"
            />
            {images.length > 2 && (
              <link
                rel="prefetch"
                href={images[(currentImageIndex + 2) % images.length]}
                as="image"
              />
            )}
          </>
        )}

        {/* Pause indicator */}
        {isPaused && autoPlay && (
          <div className="absolute right-4 top-4 rounded bg-black/50 px-2 py-1 text-xs text-white">
            Paused
          </div>
        )}
      </div>
    );
  },
);

OptimizedCarousel.displayName = 'OptimizedCarousel';

export default OptimizedCarousel;
