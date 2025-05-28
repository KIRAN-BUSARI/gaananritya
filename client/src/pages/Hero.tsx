import HeroSectionBgCarousel from '@/components/heroSectionBgCarousal';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import imgUrl0 from '@/assets/heroSection0.png';
import imgUrl2 from '@/assets/heroSection2.png';
import imgUrl3 from '@/assets/heroSection3.png';
import imgUrl4 from '@/assets/heroSection4.png';

import mImg1 from '@/assets/mobileCarousal1.png';
import mImg2 from '@/assets/mobileCarousal2.png';
import mImg3 from '@/assets/mobileCarousal3.png';
import mImg4 from '@/assets/mobileCarousal4.png';
import mImg5 from '@/assets/mobileCarousal5.png';

import { ArrowRight } from 'lucide-react';

const images = [imgUrl0, imgUrl2, imgUrl3, imgUrl4];
const mobileImages = [mImg1, mImg2, mImg3, mImg4, mImg5];

export default function Hero() {
  const handleScrollToAchievements = () => {
    const achievementsSection = document.getElementById('achievements');
    if (achievementsSection) {
      achievementsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mx-auto mb-10 w-full items-center justify-center overflow-hidden px-2 md:mb-0 md:h-[calc(100vh-100px)] md:px-20">
      <div className="absolute inset-0 z-0 hidden md:block">
        <HeroSectionBgCarousel images={images} interval={4000} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
      </div>

      <div className="relative flex h-full w-full items-center lg:justify-start">
        <div className="px-2">
          <div className="mt-4 flex md:hidden">
            <HeroSectionBgCarousel
              images={mobileImages}
              interval={2000}
              className="relative h-[450px] rounded-2xl shadow-xl"
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-balance text-left text-3xl font-semibold leading-[130%] tracking-[-1.5px] md:text-[42px] md:font-medium md:text-primary"
            >
              Celebrating{' '}
              <span className="text-secondary1 md:text-secondary">
                30 Years
              </span>{' '}
              of <br className="hidden lg:block" /> Nurturing Dreams Through{' '}
              <br className="hidden lg:block" /> Indian Music & Dance{' '}
              <br className="hidden lg:block" />
              <span className="block text-secondary1 md:text-secondary">
                Gaana Nritya Academy
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-4 text-balance text-left text-base font-normal leading-[25px] md:leading-[30px] md:text-primary lg:text-lg"
            >
              Spreading the Joy of Art to Generations Across{' '}
              <br className="hidden md:block" /> Cities and Rural Communities{' '}
              <span className="font-medium text-secondary1 md:text-secondary">
                Since 1994.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-8 flex w-full flex-col items-start space-y-4 sm:flex-row sm:space-x-5 sm:space-y-0 md:mt-8"
            >
              <Link to="/classes" className="w-full sm:w-auto">
                <Button className="group w-full overflow-hidden rounded-lg border-secondary bg-secondary px-8 py-6 text-lg font-medium text-primary transition-all duration-300 hover:shadow-lg sm:w-auto md:text-xl">
                  <span className="relative">
                    Explore Classes
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="group w-full overflow-hidden rounded-lg border-2 border-secondary bg-transparent px-8 py-6 text-lg font-medium transition-all duration-300 hover:border-white hover:bg-secondary/5 hover:text-secondary sm:w-auto md:text-xl"
                onClick={handleScrollToAchievements}
              >
                <span className="relative text-secondary1 md:text-secondary">
                  Our Achievements
                </span>
              </Button>
            </motion.div>

            {/* notification */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-6 flex w-full justify-start md:w-auto"
            >
              <div className="rounded-full bg-white/10 px-2 py-2 backdrop-blur-sm md:px-6 md:py-2">
                <span className="flex items-center text-xs font-medium text-secondary1 md:text-sm md:text-white">
                  <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 md:mr-2 md:h-2 md:w-2"></span>
                  New Admission Open for 2025-26
                  <span className="hidden md:inline"> Season</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
