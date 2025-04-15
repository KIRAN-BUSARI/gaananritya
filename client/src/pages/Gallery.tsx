'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import GalleryCard from '@/components/Cards/GalleryCard';
import axiosInstnace from '@/helper/axiosInstance';

interface GalleryImage {
  image: string;
  category: string;
}

interface Tab {
  title: string;
}

const tabs: Tab[] = [
  { title: 'all' },
  { title: 'productions' },
  { title: 'classes' },
  { title: 'events' },
  { title: 'archive' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setError(null);
    try {
      const { data } = await axiosInstnace.get<{ data: GalleryImage[] }>(
        '/gallery/all',
      );
      setImages(data.data);
    } catch (err) {
      setError('Failed to fetch images. Please try again later.');
      console.error('Error fetching images:', err);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const filteredImages = useMemo(() => {
    if (filter === 'all') return images;
    return images.filter((image) => image.category === filter);
  }, [images, filter]);

  const handleFilterChange = useCallback((category: string) => {
    setFilter(category);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div className="py-8 text-center">Loading gallery...</div>;
    }
    if (error) {
      return <div className="py-8 text-center text-red-500">{error}</div>;
    }
    if (filteredImages.length === 0) {
      return (
        <div className="py-8 text-center">
          No images found for this category.
        </div>
      );
    }

    return (
      <motion.div
        className="grid grid-cols-2 place-content-between justify-between gap-4 md:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredImages.map((img) => (
          <motion.div key={img.image} variants={itemVariants}>
            <GalleryCard img={img.image} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <section
      className="h-auto px-4 py-16 md:px-20 md:py-24 lg:px-[120px]"
      id="gallery"
    >
      <div className="mb-8 md:mb-12">
        {' '}
        <div className="flex flex-col space-y-3 text-left md:space-y-5">
          {' '}
          <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            A Journey in Rhythm, Grace & Celebration
          </h1>
          <p className="text-balance text-sm font-normal text-gray-700 md:text-base md:leading-relaxed">
            {' '}
            A glimpse into our vibrant classes, soulful productions, and joyful
            community events.
          </p>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="mb-8 flex flex-wrap gap-2 md:gap-4">
        {' '}
        {tabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => handleFilterChange(tab.title)}
            className={`rounded-md border border-gray-300 px-3 py-1.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 md:px-4 md:py-1 md:text-base ${
              filter === tab.title
                ? 'border-secondary bg-secondary text-primary'
                : 'bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-100'
            }`}
          >
            {tab.title.charAt(0).toUpperCase() + tab.title.slice(1)}{' '}
          </button>
        ))}
      </div>

      <div className="mt-8 md:mt-12">{renderContent()}</div>
    </section>
  );
}

export default Gallery;
