import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
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
}

/**
 * ResponsiveImage component with WebP support, lazy loading, and performance optimizations
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
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
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

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

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [lazy, priority, isInView]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  // Check WebP support
  const supportsWebP = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Get the best image source
  const getImageSrc = () => {
    if (isError && fallback) return fallback;
    if (webpSrc && supportsWebP()) return webpSrc;
    return src;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc: string) => {
    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    const { name, ext } = getImageNameAndExt(baseSrc);

    return breakpoints
      .map((width) => {
        const responsiveSrc = `${name}-${width}w${ext}`;
        return `${responsiveSrc} ${width}w`;
      })
      .join(', ');
  };

  const getImageNameAndExt = (imageSrc: string) => {
    const lastDot = imageSrc.lastIndexOf('.');
    const lastSlash = imageSrc.lastIndexOf('/');
    const name = imageSrc.substring(lastSlash + 1, lastDot);
    const ext = imageSrc.substring(lastDot);
    const path = imageSrc.substring(0, lastSlash + 1);

    return { name: path + name, ext };
  };

  // Don't render until in view (for lazy loading)
  if (lazy && !priority && !isInView) {
    return (
      <div
        ref={imgRef}
        className={cn(
          'flex animate-pulse items-center justify-center bg-gray-200',
          className,
        )}
      >
        {placeholder && (
          <img
            src={placeholder}
            alt=""
            className="h-full w-full object-cover opacity-50"
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200',
            className,
          )}
        >
          {placeholder && (
            <img
              src={placeholder}
              alt=""
              className="h-full w-full object-cover opacity-50"
            />
          )}
        </div>
      )}

      {/* Main image with WebP support */}
      <picture>
        {webpSrc && (
          <source
            srcSet={generateSrcSet(webpSrc)}
            sizes={sizes}
            type="image/webp"
          />
        )}
        <source srcSet={generateSrcSet(src)} sizes={sizes} type="image/jpeg" />
        <img
          ref={imgRef}
          src={getImageSrc()}
          alt={alt}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
        />
      </picture>

      {/* Error state */}
      {isError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
          <span className="text-sm text-gray-500">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;
