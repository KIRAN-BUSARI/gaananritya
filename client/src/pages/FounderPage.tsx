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
    <div className="relative mx-auto my-8 min-h-[calc(100vh-100px)] w-full px-4 sm:px-6 md:my-12 md:px-8 lg:my-20 lg:px-12 xl:px-[120px]">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold leading-[130%] tracking-[-1.5%] text-[#2b2b2e] md:text-[28px] lg:text-[32px]">
          Founder & Artistic Director: Guru. Vidyashree Radhakrishna
        </h1>
        <h2 className="mt-2 text-balance text-base font-normal leading-[170%] tracking-[-1%] md:text-lg">
          <span className="font-semibold">Vidyashree Radhakrishna</span> founded
          <span className="text-secondary1 font-semibold">
            {' '}
            Gaana Nritya Academy
          </span>{' '}
          in 1994 to preserve Indian classical music and dance, inspiring youth
          in rural and urban Karnataka. A leading academy, it nurtures
          Bharatanatyam and music talent.
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-12 md:gap-8 lg:gap-14">
        <div className="relative col-span-1 flex justify-center md:col-span-12 md:justify-start lg:col-span-6">
          <HeroSectionBgCarousel
            className="h-[350px] w-full max-w-[565px] rounded-sm sm:h-[450px] md:h-[500px] lg:h-[600px]"
            images={imgs}
          />
        </div>

        <div className="col-span-1 mt-6 flex flex-col justify-center md:col-span-12 lg:col-span-6 lg:mt-0">
          <ul className="list-outside list-disc space-y-4 pl-5 text-base marker:text-[#1d6d8d] md:space-y-6 md:text-lg lg:space-y-8">
            <li className="leading-[160%] tracking-[-1%] md:leading-[170%]">
              <span className="text-secondary1 font-semibold">
                Artistic Journey:
              </span>{' '}
              Trained under Guru Padma Subramanyam, Kalakshetra, and luminaries
              like Late Guru Muralidhar Rao and Guru Bragha Bessell. Trained
              vocalist and Natuvanar.
            </li>
            <li className="leading-[160%] tracking-[-1%] md:leading-[170%]">
              <span className="text-secondary1 font-semibold">
                Achievements:
              </span>{' '}
              Karnataka Kala Jyothi awardee, ICCR Empaneled Artiste, and graded
              artiste of Bengaluru Doordarshan. Honored with the Bharatha Muni
              Award for her contributions to dance. Her disciples have earned
              national recognition in Bharatanatyam competitions.
            </li>
            <li className="leading-[160%] tracking-[-1%] md:leading-[170%]">
              <span className="text-secondary1 font-semibold">Impact:</span>{' '}
              Reached 1,000+ rural students via Routes to Roots and promotes
              young artists through festivals like Aarohana.
            </li>
            <li className="leading-[160%] tracking-[-1%] md:leading-[170%]">
              <span className="text-secondary1 font-semibold">
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
