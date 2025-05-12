import carousal1 from '../assets/carousal1.png';
import carousal2 from '../assets/carousal2.png';
import carousal3 from '../assets/carousal3.png';
import HeroSectionBgCarousel from '@/components/heroSectionBgCarousal';
// import axiosInstance from '@/helper/axiosInstance';
// import { useEffect, useState } from 'react';

const FounderPage = () => {
  // const [imgs, setImgs] = useState([]);

  // const fetchCarousalImages = async () => {
  //   const res = await axiosInstance.get('/carousal/images');
  //   setImgs(res.data);
  // };

  // useEffect(() => {
  //   fetchCarousalImages();
  // }, []);

  // TODO: Replace with actual images or fetch dynamically
  const imgs = [carousal1, carousal2, carousal3];

  return (
    <div
      className="relative mx-auto my-8 h-auto w-full px-4 sm:px-6 md:mt-12 md:px-8 lg:mt-20 lg:px-12 xl:px-20"
      id="founder"
    >
      {/* Header Section */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold leading-[130%] tracking-[-1.5%] text-[#2b2b2e] sm:text-3xl md:text-[28px] lg:text-[32px]">
          Founder & Artistic Director: Guru. Vidyashree Radhakrishna
        </h1>
        <h2 className="mt-2 text-balance text-left text-lg leading-[170%] tracking-[-1%] text-[#2b2b2e]">
          <span className="font-semibold">Vidyashree Radhakrishna</span> founded
          <span className="font-semibold text-secondary1">
            {' '}
            Gaana Nritya Academy
          </span>{' '}
          in 1994 to preserve Indian classical music and dance,{' '}
          <br className="hidden md:block" /> inspiring youth in rural and urban
          Karnataka. A leading academy, it nurtures Bharatanatyam and music
          talent.
        </h2>
      </div>
      <div className="mt-12 flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
        <div className="relative flex justify-center md:justify-start lg:w-full xl:w-5/12">
          <HeroSectionBgCarousel
            className="-z-10 h-[400px] w-full max-w-[565px] rounded-2xl md:h-[500px] lg:h-[600px]"
            images={imgs}
            interval={4000}
          />
        </div>

        <div className="mt-6 flex flex-col justify-center lg:mt-0 lg:w-1/2 xl:w-7/12">
          <ul className="list-outside list-disc space-y-6 text-balance pl-5 text-lg marker:text-[#1d6d8d] sm:text-lg md:space-y-6 lg:space-y-8">
            <li className="leading-[160%] tracking-[-1%] md:leading-[170%]">
              <span className="font-semibold text-secondary1">
                Artistic Journey:
              </span>{' '}
              Trained under Guru Padma Subramanyam, Kalakshetra, and luminaries
              like Late Guru Muralidhar Rao and Guru Bragha Bessell. Trained
              vocalist and Natuvanar.
            </li>
            <li className="leading-[160%] tracking-[-1%] md:leading-[170%]">
              <span className="font-semibold text-secondary1">
                Achievements:
              </span>{' '}
              Karnataka Kala Jyothi awardee, ICCR Empaneled Artiste, and graded
              artiste of Bengaluru Doordarshan. Honored with the Bharatha Muni
              Award for her contributions to dance. Her disciples have earned
              national recognition in Bharatanatyam competitions.
            </li>
            <li className="leading-[160%] tracking-[-1%] md:leading-[170%]">
              <span className="font-semibold text-secondary1">Impact:</span>{' '}
              Reached 1,000+ rural students via Routes to Roots and promotes
              young artists through festivals like Aarohana.
            </li>
            <li className="leading-[160%] tracking-[-1%] md:leading-[170%]">
              <span className="font-semibold text-secondary1">
                Global Presence:
              </span>{' '}
              Performed in South Korea's Sarang Festival, UK, and more,
              representing Indian culture.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FounderPage;
