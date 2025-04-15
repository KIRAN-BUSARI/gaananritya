'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import GalleryCard from '@/components/Cards/GalleryCard';
import axiosInstnace from '@/helper/axiosInstance';

interface GalleryImage {
  image: string;
  category: string;
}

interface Tabs {
  title: string;
}

const tabs: Tabs[] = [
  { title: 'productions' },
  { title: 'classes' },
  { title: 'events' },
  { title: 'archive' },
];

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await axiosInstnace.get('/gallery/all');
      setImages(data.data);
    } catch (err) {
      setError('Failed to fetch images. Please try again later.');
      console.error('Error fetching images:', err);
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

  const handleFilterChange = (category: string) => {
    setFilter(category);
  };

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <section
      className="h-auto px-4 py-20 md:px-[120px] md:py-[100px]"
      id="gallery"
    >
      <div className="flex flex-col justify-center">
        <div className="flex flex-col space-y-5 text-center">
          <h1 className="text-left text-2xl font-semibold md:text-4xl">
            A Journey in Rhythm, Grace & Celebration
          </h1>
          <p className="text-balance text-left text-sm font-normal md:text-base md:leading-6">
            A glimpse into our vibrant classes, soulful productions, and joyful
            community events.
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => handleFilterChange(tab.title)}
            className={`rounded-sm border px-4 py-1 text-primary backdrop-blur-sm transition-all duration-200 hover:border-[#1d6d8d] sm:px-4 md:font-medium lg:font-normal ${
              filter === tab.title ? 'bg-secondary' : ''
            }`}
          >
            <p
              className={`text-sm font-normal md:text-base ${
                filter === tab.title ? 'text-primary' : 'text-[#000000]'
              }`}
            >
              {tab.title}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-12">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <motion.div
            className="grid grid-cols-2 justify-between gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {filteredImages.map((img, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.3 }}
              >
                <GalleryCard img={img.image} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Gallery;
