import { cn } from '@/lib/utils';
import React, { useState, useEffect, useCallback } from 'react';

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
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  if (images.length === 0) {
    return <div className="text-center text-white">No images available</div>;
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-black',
        'h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[calc(100vh-100px)]',
        className,
      )}
    >
      {images.map((imageUrl, index) => (
        <div
          key={`carousel-image-${index}`}
          aria-hidden={index !== currentImageIndex}
          className="absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${imageUrl})`,
            opacity: index === currentImageIndex ? 1 : 0,
            zIndex: index === currentImageIndex ? 10 : 0,
          }}
        />
      ))}
    </div>
  );
};

export default HeroSectionBgCarousel;
