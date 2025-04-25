import AchievementCard from '@/components/Cards/AchivementCard';

import handSign from '@/assets/handSign.png';

import Img1 from '@/assets/achievementsImg1.png';
import Img2 from '@/assets/achievementsImg2.png';
import Img3 from '@/assets/achievementsImg3.png';
import Img4 from '@/assets/achievementsImg4.png';
import GalleryCard from '@/components/Cards/GalleryCard';
import HeroSectionBgCarousel from '@/components/heroSectionBgCarousal';

interface AchievementData {
  id: string;
  title: string;
  number: string;
  color: string;
  textColor: string;
}

const achievements: AchievementData[] = [
  {
    id: '1',
    title: 'Students Trained',
    number: '1500+',
    color: '#EEFAFF',
    textColor: '#1D6D8D',
  },
  {
    id: '2',
    title: 'Rangapravesha',
    number: '45+',
    color: '#FFEFEE',
    textColor: '#FF6F61',
  },
  {
    id: '3',
    title: 'Performance',
    number: '738+',
    color: '#EEFAFF',
    textColor: '#1D6D8D',
  },
  {
    id: '4',
    title: 'Countries',
    number: '13+',
    color: '#FFEFEE',
    textColor: '#FF6F61',
  },
];

const achievementsImages: string[] = [Img1, Img2, Img3, Img4];

const Achievements = () => {
  return (
    <div className="relative px-6 py-10 sm:px-10 lg:px-[120px] lg:py-20">
      {/* Header Section */}
      <div>
        <h1 className="text-[32px] font-semibold leading-[130%] tracking-[-1.5%] sm:text-2xl lg:text-[32px]">
          Milestones & Achievements That Shaped Our Journey
        </h1>
        <p className="mt-4 text-lg leading-[170%] tracking-[-1%] sm:text-base lg:text-lg">
          A journey marked by{' '}
          <span className="font-semibold">
            national honors, artistic innovations,
          </span>{' '}
          and the nurturing of future torchbearers of Indian classical dance.
        </p>
      </div>

      {/* Achievement Cards */}
      <div
        className="relative mt-8 grid grid-cols-1 gap-6 place-self-center sm:grid-cols-2 md:place-self-auto lg:grid-cols-4"
        id="cards"
      >
        {achievements.map((data) => (
          <AchievementCard
            textColor={data.textColor}
            color={data.color}
            key={data.id}
            title={data.title}
            number={data.number}
          />
        ))}
      </div>

      {/* Decorative Image */}
      <img
        className="absolute right-0 top-[590px] block h-auto w-[150px] sm:top-[120px] sm:hidden sm:w-[260px] md:top-[100px] md:block md:w-[200px] lg:top-[190px]"
        src={handSign}
        alt="handsign"
      />

      {/* Achievements Details */}
      <div className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:my-12 lg:gap-8">
        {/* Left Section */}
        <div className="rounded-2xl bg-[#EEFAFF] px-4 py-8 sm:px-6 sm:py-12">
          <ul className="list-outside list-disc space-y-4 pl-6 text-lg leading-[170%] sm:space-y-6 sm:pl-8">
            <li>
              Honored with prestigious titles such as Karnataka{' '}
              <span className="font-semibold">
                Kalajyothi, Young Achiever Award, Bharatha Muni Award, Natya
                Shikshana Award, Yuva Saadhaki, and Laasya Nipune,
              </span>{' '}
              among many others.
            </li>
            <li>
              Recognized as{' '}
              <span className="font-semibold">
                &apos;A&apos; graded artist of Bengaluru Doordarshan.
              </span>
            </li>
            <li>
              <span className="font-semibold">
                Empaneled artiste with Indian Council for Cultural Relations
                (ICCR)
              </span>
              , Ministry of External Affairs, Government of India.
            </li>
            <li>
              Global Presence:{' '}
              <span className="font-semibold">
                Performed in South Korea&apos;s
              </span>{' '}
              Sarang Festival, <span className="font-semibold">UK</span>, and
              more, representing Indian culture.
            </li>
          </ul>
        </div>

        {/* Carousel for Mobile */}
        <div className="block md:hidden">
          <HeroSectionBgCarousel interval={2000} images={achievementsImages} />
        </div>

        {/* Right Section */}
        <div className="rounded-2xl bg-[#FFEFEE] px-4 py-8 sm:px-6 sm:py-12">
          <ul className="list-outside list-disc space-y-4 pl-6 text-lg leading-[170%] sm:space-y-6 sm:pl-8">
            <li>
              Directed and produced a Bharatanatyam fundamentals DVD titled{' '}
              <span className="font-semibold">&apos;Nrithyaksharam&apos;</span>,
              covering core adavus.
            </li>
            <li>
              Secured{' '}
              <span className="font-semibold">
                first place in the national-level Bharatanatyam{' '}
              </span>
              competition{' '}
              <span className="font-semibold">&apos;Vishwaroopa&apos;</span>{' '}
              conducted by Udupi Sri Krishna Mutt (2006).
            </li>
            <li>
              Promotes young talent by organizing monthly and annual dance
              festivals including{' '}
              <span className="font-semibold">
                Nritya Varsha, Nrityadhara, Nritya Nirantara, and Aarohana.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Gallery Section (Hidden on Mobile) */}
      <div className="hidden gap-6 sm:flex">
        {achievementsImages.map((img) => (
          <GalleryCard key={img} img={img} />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
