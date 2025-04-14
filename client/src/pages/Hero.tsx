import HeroSectionBgCarousel from '@/components/heroSectionBgCarousal';
import { Button } from '@/components/ui/button.tsx';
import imgUrl0 from '@/assets/heroSection0.png';
import imgUrl2 from '@/assets/heroSection2.png';
import imgUrl3 from '@/assets/heroSection3.png';
import imgUrl4 from '@/assets/heroSection4.png';

const images = [imgUrl0, imgUrl2, imgUrl3, imgUrl4];

export default function Hero() {
  return (
    <div className="relative h-[calc(100vh-100px)]">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <HeroSectionBgCarousel images={images} interval={4000} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full w-full items-center">
        <div className="px-4 sm:px-[120px]">
          <div className="flex flex-col items-center justify-center md:items-start">
            <h1 className="text-center text-2xl font-medium leading-[130%] tracking-[-1.5px] text-primary md:text-left md:text-[40px]">
              Celebrating 30 Years of <br /> Nurturing Dreams Through <br />{' '}
              Indian Music & Dance <br />{' '}
              <span className="text-secondary">Gaana Nritya Academy</span>
            </h1>
            <div className="mt-2">
              <p className="text-base font-normal leading-[30px] text-primary md:text-xl">
                Spreading the Joy of Art to Generations Across <br /> Cities and
                Rural Communities{' '}
                <span className="text-secondary">Since 1994.</span>
              </p>
            </div>
            <div className="mt-8 space-x-6">
              <Button className="rounded-[8px] bg-secondary px-8 py-2 text-xl text-[#FAFAFA]">
                Classes
              </Button>
              <Button className="hover:none border border-[#1D6D8D] bg-black px-8 py-2 text-xl text-[#FAFAFA]">
                Achievements
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
