import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: string;
  webpSrc?: string;
  placeholder?: string;
  quality?: number;
  width?: number;
  height?: number;
}

/**
 * Optimized image component with WebP support, lazy loading, and performance optimizations
 */
const OptimizedImage: React.FC<OptimizedImageProps> = memo(
  ({
    src,
    alt,
    className,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    priority = false,
    lazy = true,
    onLoad,
    onError,
    fallback,
    webpSrc,
    placeholder,
    quality = 80,
    width,
    height,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isInView, setIsInView] = useState(!lazy || priority);
    const [currentSrc, setCurrentSrc] = useState<string>('');
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // WebP support detection
    const [supportsWebP, setSupportsWebP] = useState(false);

    useEffect(() => {
      const checkWebPSupport = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const isSupported =
          canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        setSupportsWebP(isSupported);
      };

      checkWebPSupport();
    }, []);

    // Set the appropriate source based on WebP support
    useEffect(() => {
      if (supportsWebP && webpSrc) {
        setCurrentSrc(webpSrc);
      } else {
        setCurrentSrc(src);
      }
    }, [src, webpSrc, supportsWebP]);

    // Intersection Observer for lazy loading
    useEffect(() => {
      if (!lazy || priority || isInView) return;

      const currentImgRef = imgRef.current;
      if (!currentImgRef) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        },
      );

      observerRef.current.observe(currentImgRef);

      return () => {
        observerRef.current?.disconnect();
      };
    }, [lazy, priority, isInView]);

    const handleLoad = () => {
      setIsLoaded(true);
      setIsError(false);
      onLoad?.();
    };

    const handleError = () => {
      setIsError(true);
      onError?.();

      // Try fallback if WebP fails
      if (currentSrc === webpSrc && src !== webpSrc) {
        setCurrentSrc(src);
        setIsError(false);
      }
    };

    // Generate srcSet for responsive images
    const generateSrcSet = (baseSrc: string) => {
      if (!width) return undefined;

      const breakpoints = [320, 640, 768, 1024, 1280, 1920];
      return breakpoints
        .filter((bp) => bp <= width * 2) // Don't generate larger than 2x the original
        .map((bp) => {
          const scale = bp / width;
          const scaledHeight = height ? Math.round(height * scale) : '';
          const heightParam = scaledHeight ? `&h=${scaledHeight}` : '';
          return `${baseSrc}?w=${bp}&q=${quality}${heightParam} ${bp}w`;
        })
        .join(', ');
    };

    // Don't render until in view (for lazy loading)
    if (lazy && !priority && !isInView) {
      return (
        <div
          ref={imgRef}
          className={cn(
            'flex animate-pulse items-center justify-center bg-gray-200 dark:bg-gray-800',
            className,
          )}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined,
          }}
        >
          {placeholder && (
            <img
              src={placeholder}
              alt=""
              className="h-full w-full object-cover opacity-50 blur-sm"
              loading="lazy"
            />
          )}
        </div>
      );
    }

    return (
      <div className={cn('relative overflow-hidden', className)}>
        {/* Loading placeholder */}
        {!isLoaded && !isError && (
          <div
            className={cn(
              'absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200 dark:bg-gray-800',
              className,
            )}
          >
            {placeholder && (
              <img
                src={placeholder}
                alt=""
                className="h-full w-full object-cover opacity-50 blur-sm"
                loading="lazy"
              />
            )}
          </div>
        )}

        {/* Error fallback */}
        {isError && fallback && (
          <div
            className={cn(
              'flex items-center justify-center bg-gray-100 dark:bg-gray-800',
              className,
            )}
          >
            <img
              src={fallback}
              alt={alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Main image */}
        {isInView && currentSrc && (
          <picture>
            {webpSrc && supportsWebP && (
              <source
                srcSet={generateSrcSet(webpSrc)}
                sizes={sizes}
                type="image/webp"
              />
            )}
            <img
              ref={imgRef}
              src={currentSrc}
              srcSet={generateSrcSet(currentSrc)}
              sizes={sizes}
              alt={alt}
              className={cn(
                'h-full w-full object-cover transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                className,
              )}
              onLoad={handleLoad}
              onError={handleError}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              width={width}
              height={height}
              style={{
                aspectRatio: width && height ? `${width}/${height}` : undefined,
              }}
            />
          </picture>
        )}
      </div>
    );
  },
);

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
