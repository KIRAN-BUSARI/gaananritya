import { motion } from 'framer-motion';
import CarouselComponent from '@/components/CarousalComponent';
import img1 from '@/assets/Frame 156@1x.png';
import img2 from '@/assets/Frame 153@1x.png';
import img3 from '@/assets/Frame 154@1x.png';
import img4 from '@/assets/Frame 155@1x.png';

const heroImages = [
  { id: 1, image: img1 },
  { id: 2, image: img2 },
  { id: 3, image: img3 },
  { id: 4, image: img4 },
];

export default function Hero() {
  return (
    <div className="h-auto py-10 sm:py-0 sm:pt-20">
      <div className="grid gap-8 px-4 sm:grid-cols-12 sm:px-[120px]">
        <motion.div
          className="order-last col-span-12 flex flex-col justify-center text-white sm:order-first sm:col-span-6 sm:items-start sm:space-y-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: -0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.p
            className="text-balance text-center text-xl font-semibold leading-8 tracking-[-1%] text-primary sm:text-start sm:text-[32px] sm:font-normal sm:leading-[120%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Celebrating 30 Years of Nurturing Dreams Through Indian Music &
            Dance <span className="text-secondary">Gaana Nritya Academy</span>
          </motion.p>

          <motion.p
            className="text-center text-xs leading-5 tracking-[-3%] text-primary/80 sm:text-start sm:text-lg sm:leading-[21px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <i>
              Spreading the Joy of Art to Generations Across Cities{' '}
              <br className="hidden sm:block" />
              and Rural Communities Since 1994.
            </i>
          </motion.p>

          <motion.div
            className="mt-5 flex justify-center sm:justify-start"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button
              className="rounded-lg bg-secondary px-8 py-2 font-medium text-opacity-100 shadow-lg shadow-secondary/50 hover:opacity-90 sm:mr-[100px] sm:px-6 sm:py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Performance
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div
          className="relative order-first col-span-12 flex justify-center overflow-hidden sm:order-last sm:col-span-6 sm:justify-end"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CarouselComponent images={heroImages} />
        </motion.div>
      </div>
    </div>
  );
}
