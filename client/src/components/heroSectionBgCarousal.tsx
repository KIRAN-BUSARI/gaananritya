import React, { useState, useEffect } from 'react';

interface HeroSectionBgCarouselProps {
  images: string[];
  interval?: number;
}

const HeroSectionBgCarousel: React.FC<HeroSectionBgCarouselProps> = ({
  images,
  interval,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative h-[calc(100vh-100px)] w-full overflow-hidden">
      {images.map((imageUrl, index) => (
        <div
          key={imageUrl}
          className={`absolute left-0 top-0 h-[calc(100vh-100px)] w-full bg-cover bg-center opacity-0 ease-in-out ${index === currentImageIndex ? 'opacity-100' : ''}`}
          style={{
            backgroundImage: `url(${imageUrl})`,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      ))}
    </div>
  );
};

export default HeroSectionBgCarousel;
