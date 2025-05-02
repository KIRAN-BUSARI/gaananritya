'use client';

import { useEffect, useRef, FC, useState } from 'react';

interface Image {
  id: number;
  image: string;
}

interface CarouselProps {
  images: Image[];
  delay?: number;
}

const CarouselComponent: FC<CarouselProps> = ({ images, delay = 2000 }) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    let start: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (elapsed > delay) {
        start = timestamp;
        if (carousel) {
          carousel.appendChild(carousel.firstElementChild!);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
          carousel.style.transition = 'none';
          carousel.style.transform = 'translateX(0)';
          requestAnimationFrame(() => {
            carousel.style.transition = 'transform 0.5s';
            carousel.style.transform = `translateX(-${
              carousel.firstElementChild!.clientWidth
            }px)`;
          });
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [delay, images.length]);

  return (
    <div className="w-full overflow-hidden rounded-sm">
      <div
        className="flex transition-transform duration-500 ease-linear"
        ref={carouselRef}
      >
        {images.map((image) => (
          <div key={image.id} className="w-full flex-shrink-0">
            <img
              src={image.image}
              alt={`Slide ${image.id}`}
              className="h-auto w-full object-cover sm:h-[300px] md:h-[400px] lg:h-[500px]"
              width={1000}
              height={1000}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center space-x-3 md:mt-5 md:space-x-5">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full md:h-3 md:w-3 ${
              index === currentIndex ? 'bg-secondary/50' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselComponent;
