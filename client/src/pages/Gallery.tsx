'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import GalleryCard from '@/components/Cards/GalleryCard';
import axiosInstnace from '@/helper/axiosInstance';

interface GalleryImage {
  image: string;
}

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const fetchImages = async () => {
    const { data } = await axiosInstnace.get('/gallery/all');
    // console.log(data.data);
    setImages(data.data);
  };
  useEffect(() => {
    fetchImages();
  }, []);
  return (
    <section
      className="h-auto px-4 py-20 md:px-[120px] md:py-[100px]"
      id="gallery"
    >
      <div className="flex flex-col justify-center">
        <div className="flex flex-col space-y-5 text-center">
          <h1 className="text-left text-2xl font-semibold text-[#181818] md:text-4xl">
            A Journey in Rhythm, Grace & Celebration
          </h1>
          <p className="text-balance text-left text-sm font-normal md:text-base md:leading-6">
            A glimpse into our vibrant classes, soulful productions, and joyful
            community events.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <motion.div
          className="grid grid-cols-2 justify-between gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {images.map((img, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.3 }}
              className=""
            >
              <GalleryCard img={img.image} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Gallery;
