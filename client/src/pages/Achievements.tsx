import AchievementCard from '@/components/Cards/AchivementCard';

import Img1 from '@/assets/achievementsImg1.webp';
import Img2 from '@/assets/achievementsImg2.webp';
import Img3 from '@/assets/achievementsImg3.webp';
import Img4 from '@/assets/achievementsImg4.webp';
import AchievementGalleryCard from '@/components/Cards/AchievementGalleryCard';
import HeroSectionBgCarousel from '@/components/heroSectionBgCarousal';

import handSign from '@/assets/handSign.webp';

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
    number: '5000+',
    color: '#EEFAFF',
    textColor: '#1D6D8D',
  },
  {
    id: '2',
    title: 'Rangapravesha',
    number: '13+',
    color: '#FFEFEE',
    textColor: '#FF6F61',
  },
  {
    id: '3',
    title: 'Performance',
    number: '1500+',
    color: '#EEFAFF',
    textColor: '#1D6D8D',
  },
  {
    id: '4',
    title: 'Countries',
    number: '5+',
    color: '#FFEFEE',
    textColor: '#FF6F61',
  },
  {
    id: '5',
    title: 'Workshops',
    number: '50+',
    color: '#EEFAFF',
    textColor: '#1D6D8D',
  },
];

const achievementsImages: string[] = [Img1, Img2, Img3, Img4];

const Achievements = () => {
  return (
    <div
      id="achievements"
      className="relative px-4 py-10 sm:px-10 lg:px-20 lg:py-20"
    >
      <img
        className="absolute right-0 hidden h-auto w-[230px] sm:hidden sm:w-[260px] md:-top-44 md:block md:w-[350px] 2xl:-top-56 2xl:w-[450px]"
        src={handSign}
        alt="handsign"
      />
      {/* Header Section */}
      <div>
        <h1 className="text-[32px] font-semibold leading-[130%] tracking-[-1.5%] sm:text-2xl lg:text-[32px]">
          Milestones & Achievements That Shaped Our Journey
        </h1>
        <p className="mt-2 text-lg leading-[170%] tracking-[-1%] sm:text-base lg:text-lg">
          A journey marked by{' '}
          <span className="font-semibold">
            national honors, artistic innovations,
          </span>{' '}
          and the nurturing of future torchbearers of Indian classical dance.
        </p>
      </div>

      <div
        className="relative mt-8 grid grid-cols-1 gap-6 place-self-center sm:grid-cols-2 md:place-self-auto lg:grid-cols-5 xl:max-w-6xl 2xl:max-w-screen-2xl"
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

      <img
        className="absolute bottom-0 right-0 top-[730px] block h-auto w-[240px] md:hidden"
        src={handSign}
        alt="handsign"
      />
      <div className="mt-14 hidden gap-6 sm:flex">
        {achievementsImages.map((img) => (
          <AchievementGalleryCard key={img} img={img} />
        ))}
      </div>
      <div className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:my-12 lg:gap-8 2xl:mx-auto 2xl:my-16 2xl:gap-10">
        <div className="rounded-2xl bg-[#EEFAFF] px-2 py-8 sm:px-6 sm:py-12 2xl:px-8 2xl:py-14">
          <ul className="list-outside list-disc space-y-4 pl-6 text-lg leading-[170%] sm:space-y-6 sm:pl-8 2xl:space-y-7">
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
                graded artist of Bengaluru Doordarshan.
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
          <HeroSectionBgCarousel
            className="h-[400px] rounded-2xl"
            interval={2000}
            images={achievementsImages}
          />
        </div>

        {/* Right Section */}
        <div className="rounded-2xl bg-[#FFEFEE] px-2 py-8 sm:px-6 sm:py-12 2xl:px-8 2xl:py-14">
          <ul className="list-outside list-disc space-y-4 pl-6 text-lg leading-[170%] sm:space-y-6 sm:pl-8 2xl:space-y-7">
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
                Prerana, Vistharana, Nrityadhara, Nritya Nirantara, and
                Aarohana.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
