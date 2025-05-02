import React, { useRef, useState, useEffect } from 'react';
import VideoCard from './Cards/VideoCard';
import { Button } from './ui/button';

interface VideoCarouselProps {
  videos: Array<{
    _id: string;
    videoUrl: string;
    title?: string;
    thumbnailUrl?: string;
    category: string;
  }>;
  onDeleteVideo?: (videoId: string) => void;
  isAdmin?: boolean;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({
  videos,
  onDeleteVideo,
  isAdmin = false,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateMeasurements = () => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        setContainerWidth(container.clientWidth);

        const scrollWidth = container.scrollWidth;
        setContentWidth(scrollWidth);

        setScrollPosition(container.scrollLeft);
      }
    };

    updateMeasurements();

    window.addEventListener('resize', updateMeasurements);

    return () => {
      window.removeEventListener('resize', updateMeasurements);
    };
  }, [videos]);

  useEffect(() => {
    const handleScrollEvent = () => {
      if (carouselRef.current) {
        setScrollPosition(carouselRef.current.scrollLeft);
      }
    };

    const container = carouselRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollEvent);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScrollEvent);
      }
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = carouselRef.current;
    if (!container) return;

    const firstCard = container.querySelector('div');
    const cardWidth = firstCard ? firstCard.clientWidth : 0;
    const gap = 16;
    const scrollAmount = cardWidth + gap;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const canScrollLeft = scrollPosition > 1;
  const canScrollRight =
    contentWidth > containerWidth &&
    scrollPosition < contentWidth - containerWidth - 1;

  if (videos.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100">
        <p className="text-gray-500">No videos available</p>
      </div>
    );
  }

  return (
    <div className="relative flex w-full items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 z-10 h-8 w-8 rounded-full bg-secondary shadow-md hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => handleScroll('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <span className="sr-only">Scroll left</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-white"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </Button>

      {/* Videos Container */}
      <div
        ref={carouselRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto py-2 md:gap-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        {videos.map((video) => (
          <div
            key={video._id}
            className="min-w-[calc(100%-16px)] snap-start sm:min-w-[calc(50%-16px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-20px)] xl:min-w-[calc(20%-20px)]"
          >
            <VideoCard
              videoUrl={video.videoUrl}
              title={video.title}
              thumbnailUrl={video.thumbnailUrl}
              onDelete={
                isAdmin && onDeleteVideo
                  ? () => onDeleteVideo(video._id)
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {/* Right Navigation Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 z-10 h-8 w-8 rounded-full bg-secondary shadow-md hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => handleScroll('right')}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <span className="sr-only">Scroll right</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-white"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Button>
    </div>
  );
};

export default VideoCarousel;
