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

  useEffect(() => {
    if (!images || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) {
    return <div className="text-center text-white">No images available</div>;
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-black',
        'h-[350px] md:h-[calc(100vh-100px)]',
        className,
      )}
    >
      {images.map((imageUrl, index) => (
        <div
          key={index}
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
