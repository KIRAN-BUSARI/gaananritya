import { cn } from '@/lib/utils';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
} from 'react';
import {
  heroImages,
  getBestImageVariant,
  OptimizedImageMeta,
} from '@/utils/optimizedImages';

interface HeroSectionBgCarouselProps {
  images?: string[]; // Keep for backward compatibility
  optimizedImages?: OptimizedImageMeta[]; // New optimized images
  interval?: number;
  className?: string;
  priority?: boolean; // For LCP optimization
  lazy?: boolean; // For controlling intersection observer
}

const HeroSectionBgCarousel: React.FC<HeroSectionBgCarouselProps> = memo(
  ({
    images = [],
    optimizedImages,
    className,
    interval = 5000,
    priority = true,
    lazy = false,
  }) => {
    // Use optimized images if provided, otherwise fall back to original images
    const imageData = optimizedImages || heroImages;
    const totalImages = imageData.length;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);
    const [isInView, setIsInView] = useState(!lazy);
    const [viewportWidth, setViewportWidth] = useState(0);
    const [supportsWebP, setSupportsWebP] = useState(false);
    const preloadedImages = useRef<HTMLImageElement[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageIndexRef = useRef(currentImageIndex);

    // Keep track of current index in ref to avoid stale closures
    imageIndexRef.current = currentImageIndex;

    // Detect WebP support
    useEffect(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const dataURL = canvas.toDataURL('image/webp');
      setSupportsWebP(dataURL.indexOf('data:image/webp') === 0);
    }, []);

    // Track viewport width for responsive images
    useEffect(() => {
      const updateViewportWidth = () => {
        setViewportWidth(window.innerWidth);
      };

      updateViewportWidth();
      window.addEventListener('resize', updateViewportWidth);
      return () => window.removeEventListener('resize', updateViewportWidth);
    }, []);

    // Get the current image source based on optimized images or fallback
    const getCurrentImageSrc = useCallback(
      (index: number): string => {
        if (optimizedImages && viewportWidth > 0) {
          return getBestImageVariant(
            imageData[index] as OptimizedImageMeta,
            viewportWidth,
            supportsWebP,
          );
        }
        // Fallback to original images array
        return images[index] || '';
      },
      [optimizedImages, imageData, viewportWidth, supportsWebP, images],
    );

    // Intersection observer for lazy loading
    useEffect(() => {
      if (!lazy || !containerRef.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        },
      );

      observer.observe(containerRef.current);

      return () => observer.disconnect();
    }, [lazy]);

    // Memoize the visible images to avoid unnecessary re-renders
    const visibleImages = useMemo(() => {
      if (totalImages <= 1) return [{ url: getCurrentImageSrc(0), index: 0 }];

      // Only render current, previous, and next image for better performance
      const current = currentImageIndex;
      const prev = (currentImageIndex - 1 + totalImages) % totalImages;
      const next = (currentImageIndex + 1) % totalImages;

      // Include previous image for smooth transitions
      return [prev, current, next].map((index) => ({
        url: getCurrentImageSrc(index),
        index,
      }));
    }, [currentImageIndex, totalImages, getCurrentImageSrc]);

    const nextImage = useCallback(() => {
      if (totalImages <= 1) return;
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % totalImages;
        imageIndexRef.current = newIndex;
        return newIndex;
      });
    }, [totalImages]);

    // Optimized timer management
    useEffect(() => {
      if (totalImages <= 1 || !isFirstImageLoaded || !isInView) return;

      intervalRef.current = setInterval(nextImage, interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [totalImages, interval, nextImage, isFirstImageLoaded, isInView]);

    // Pause carousel when tab is not visible
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.hidden && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        } else if (
          !document.hidden &&
          totalImages > 1 &&
          isFirstImageLoaded &&
          isInView
        ) {
          intervalRef.current = setInterval(nextImage, interval);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () =>
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
        );
    }, [nextImage, interval, totalImages, isFirstImageLoaded, isInView]);

    useEffect(() => {
      if (totalImages === 0 || !isInView || !viewportWidth) return;

      const loadImage = (index: number, isPriority = false): Promise<void> => {
        return new Promise((resolve) => {
          // Check if image is already loaded
          if (loadedImages.has(index)) {
            resolve();
            return;
          }

          const img = new Image();
          const src = getCurrentImageSrc(index);

          if (isPriority) {
            // For LCP optimization - load first image with high priority
            (
              img as HTMLImageElement & {
                fetchPriority?: string;
                loading?: string;
              }
            ).fetchPriority = 'high';
            (
              img as HTMLImageElement & {
                fetchPriority?: string;
                loading?: string;
              }
            ).loading = 'eager';
          } else {
            (
              img as HTMLImageElement & {
                fetchPriority?: string;
                loading?: string;
              }
            ).loading = 'lazy';
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

      // Load first image with high priority for LCP
      if (priority && totalImages > 0) {
        loadImage(0, true);
      }

      // Load remaining images with lower priority
      const loadRemainingImages = async () => {
        // Only load visible and next few images initially
        const imagesToLoadCount = Math.min(totalImages, priority ? 3 : 2);
        const promises = [];

        for (let idx = priority ? 1 : 0; idx < imagesToLoadCount; idx++) {
          promises.push(loadImage(idx, false));
        }

        await Promise.all(promises);

        // Load remaining images after a delay
        if (totalImages > 3) {
          setTimeout(() => {
            const remainingPromises = [];
            for (let idx = 3; idx < totalImages; idx++) {
              remainingPromises.push(loadImage(idx, false));
            }
            Promise.all(remainingPromises);
          }, 2000);
        }
      };

      // Delay loading of non-critical images
      const timer = setTimeout(loadRemainingImages, priority ? 100 : 0);

      return () => {
        clearTimeout(timer);
        preloadedImages.current.forEach((img: HTMLImageElement | null) => {
          if (img) {
            img.onload = null;
            img.onerror = null;
          }
        });
        preloadedImages.current = [];
      };
    }, [
      totalImages,
      priority,
      isInView,
      loadedImages,
      getCurrentImageSrc,
      viewportWidth,
    ]);

    // Don't render until in view (for lazy loading)
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

    // Show loading state until first image is loaded (for LCP)
    if (priority && !isFirstImageLoaded) {
      return (
        <div
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
          'relative w-full overflow-hidden bg-black',
          'h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[calc(100vh-100px)]',
          className,
        )}
      >
        {visibleImages.map(({ url, index }: { url: string; index: number }) => {
          const isVisible = index === currentImageIndex;
          const isLoaded = loadedImages.has(index);

          return (
            <div
              key={`carousel-image-${index}`}
              aria-hidden={!isVisible}
              className={cn(
                'absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out',
              )}
              style={{
                backgroundImage: isLoaded ? `url(${url})` : 'none',
                opacity: isVisible && isLoaded ? 1 : 0,
                zIndex: isVisible ? 10 : 1,
                transform: 'translateZ(0)', // Force hardware acceleration
                willChange: isVisible ? 'opacity' : 'auto',
                backfaceVisibility: 'hidden', // Reduce repaints
              }}
            />
          );
        })}

        {/* Optimized preloading - only preload next 2 images */}
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
      </div>
    );
  },
);

// Add display name for debugging
HeroSectionBgCarousel.displayName = 'HeroSectionBgCarousel';

export default HeroSectionBgCarousel;
