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
    <div className="w-full max-w-[90%] overflow-hidden rounded-[16px] lg:max-w-[75%]">
      <div
        className="flex transition-transform duration-500 ease-linear"
        ref={carouselRef}
      >
        {images.map((image) => (
          <div key={image.id} className="w-full flex-shrink-0">
            <img
              src={image.image}
              alt={`Slide ${image.id}`}
              width={1000}
              height={500}
            />
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center space-x-5">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full ${
              index === currentIndex ? 'bg-[#79348D]/50' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselComponent;
