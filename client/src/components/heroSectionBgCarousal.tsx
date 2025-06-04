import { cn } from '@/lib/utils';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

interface HeroSectionBgCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
  priority?: boolean; // For LCP optimization
}

const HeroSectionBgCarousel: React.FC<HeroSectionBgCarouselProps> = ({
  images = [],
  className,
  interval = 5000,
  priority = true,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);
  const preloadedImages = useRef<HTMLImageElement[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the visible images to avoid unnecessary re-renders
  const visibleImages = useMemo(() => {
    if (images.length <= 1) return images.map((url, index) => ({ url, index }));

    // Only render current, previous, and next image for better performance
    const current = currentImageIndex;
    const prev = (currentImageIndex - 1 + images.length) % images.length;
    const next = (currentImageIndex + 1) % images.length;

    // Include previous image for smooth transitions
    return [prev, current, next].map((index) => ({
      url: images[index],
      index,
    }));
  }, [images, currentImageIndex]);

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // Optimized timer management
  useEffect(() => {
    if (images.length <= 1 || !isFirstImageLoaded) return;

    intervalRef.current = setInterval(nextImage, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [images.length, interval, nextImage, isFirstImageLoaded]);

  // Pause carousel when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (!document.hidden && images.length > 1 && isFirstImageLoaded) {
        intervalRef.current = setInterval(nextImage, interval);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [nextImage, interval, images.length, isFirstImageLoaded]);

  useEffect(() => {
    if (images.length === 0) return;

    const loadImage = (
      src: string,
      index: number,
      isPriority = false,
    ): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();

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
    if (priority && images[0]) {
      loadImage(images[0], 0, true);
    }

    // Load remaining images with lower priority
    const loadRemainingImages = async () => {
      const promises = images
        .slice(priority ? 1 : 0)
        .map((src, idx) => loadImage(src, priority ? idx + 1 : idx, false));
      await Promise.all(promises);
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
  }, [images, priority]);

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
            }}
          />
        );
      })}

      {/* Preload next image */}
      {images.length > 1 && (
        <link
          rel="prefetch"
          href={images[(currentImageIndex + 1) % images.length]}
          as="image"
        />
      )}
    </div>
  );
};

export default HeroSectionBgCarousel;
