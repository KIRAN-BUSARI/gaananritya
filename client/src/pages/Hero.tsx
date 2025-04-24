import HeroSectionBgCarousel from '@/components/heroSectionBgCarousal';
import { Button } from '@/components/ui/button.tsx';
import imgUrl0 from '@/assets/heroSection0.png';
import imgUrl2 from '@/assets/heroSection2.png';
import imgUrl3 from '@/assets/heroSection3.png';
import imgUrl4 from '@/assets/heroSection4.png';

import mImg1 from '@/assets/mobileCarousal1.png';
import mImg2 from '@/assets/mobileCarousal2.png';
import mImg3 from '@/assets/mobileCarousal3.png';
import mImg4 from '@/assets/mobileCarousal4.png';
import mImg5 from '@/assets/mobileCarousal5.png';

const images = [imgUrl0, imgUrl2, imgUrl3, imgUrl4];
const mobileImages = [mImg1, mImg2, mImg3, mImg4, mImg5];

export default function Hero() {
  return (
    <div className="relative mx-auto w-full items-center justify-center overflow-hidden py-8 md:h-[calc(100vh-100px)]">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <HeroSectionBgCarousel images={images} interval={4000} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full w-full items-center justify-center lg:justify-start">
        <div className="px-4 sm:px-[120px]">
          <div className="mt-6 flex md:hidden">
            <HeroSectionBgCarousel
              images={mobileImages}
              interval={2000}
              className="relative max-h-[350px] rounded-2xl"
            />
          </div>
          <div className="flex flex-col justify-center md:items-start">
            <h1 className="mt-4 text-balance text-center text-3xl font-semibold leading-[130%] tracking-[-1.5px] md:text-left md:text-[40px] md:font-medium md:text-primary">
              Celebrating 30 Years of <br /> Nurturing Dreams Through <br />{' '}
              Indian Music & Dance <br />
              <span className="text-secondary1 md:text-secondary">
                Gaana Nritya Academy
              </span>
            </h1>
            <p className="mt-2 text-balance text-center text-2xl font-normal leading-[35px] md:text-start md:leading-[30px] md:text-primary">
              Spreading the Joy of Art to Generations Across{' '}
              <br className="hidden md:block" /> Cities and Rural Communities{' '}
              <span className="text-secondary1 md:text-secondary">
                Since 1994.
              </span>
            </p>
            <div className="mt-4 flex w-full flex-col items-center space-y-6 md:flex-row md:space-x-4 md:space-y-0">
              <Button className="w-full rounded-[8px] bg-secondary px-8 py-2 text-xl text-[#FAFAFA]">
                Classes
              </Button>
              <Button
                variant={'outline'}
                className="w-full border-2 border-[#1D6D8D] bg-transparent px-8 py-2 text-xl hover:bg-transparent md:text-primary md:hover:text-primary"
              >
                Achievements
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
