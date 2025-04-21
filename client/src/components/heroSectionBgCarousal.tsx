import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

interface HeroSectionBgCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
}

const HeroSectionBgCarousel: React.FC<HeroSectionBgCarouselProps> = ({
  images,
  className,
  interval = 5000,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setNextImageIndex((currentImageIndex + 1) % images.length);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, currentImageIndex]);

  return (
    <div
      className={cn(
        'relative h-[calc(100vh-100px)] w-full overflow-hidden bg-black',
        className,
      )}
    >
      {images.map((imageUrl, index) => (
        <div
          key={imageUrl}
          className={`absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-[1000ms] ${
            index === currentImageIndex
              ? `opacity-${isTransitioning ? '0' : '100'} z-10`
              : index === nextImageIndex
                ? `opacity-${isTransitioning ? '100' : '0'} z-0`
                : '-z-10 opacity-0'
          }`}
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        />
      ))}
    </div>
  );
};

export default HeroSectionBgCarousel;
