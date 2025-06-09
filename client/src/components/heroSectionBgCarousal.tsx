import { cn } from '@/lib/utils';
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface HeroSectionBgCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
}

const HeroSectionBgCarousel: React.FC<HeroSectionBgCarouselProps> = ({
  images = [],
  className,
  interval = 5000,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(nextImage, interval);
    return () => clearInterval(timer);
  }, [images.length, interval, nextImage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lazyImages =
              containerRef.current?.querySelectorAll('[data-lazy]');
            lazyImages?.forEach((img) => {
              const lazyImage = img as HTMLDivElement;
              const backgroundImage = lazyImage.getAttribute('data-lazy');
              if (backgroundImage) {
                lazyImage.style.backgroundImage = `url(${backgroundImage})`;
                lazyImage.removeAttribute('data-lazy');
              }
            });
          }
        });
      },
      { root: null, threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (images.length === 0) {
    return <div className="text-center text-white">No images available</div>;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden bg-black',
        '-z-10 h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[calc(100vh-100px)]',
        className,
      )}
    >
      {images.map((imageUrl, index) => (
        <div
          key={`carousel-image-${index}`}
          aria-hidden={index !== currentImageIndex}
          className="absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000"
          data-lazy={index === 0 ? undefined : imageUrl}
          style={{
            opacity: index === currentImageIndex ? 1 : 0,
            zIndex: index === currentImageIndex ? 10 : 0,
            backgroundImage: index === 0 ? `url(${imageUrl})` : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default HeroSectionBgCarousel;
