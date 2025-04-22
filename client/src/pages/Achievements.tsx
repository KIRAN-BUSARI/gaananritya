import AchievementCard from '@/components/Cards/AchivementCard';

import handSign from '@/assets/handSign.png';

import Img1 from '@/assets/achievementsImg1.png';
import Img2 from '@/assets/achievementsImg2.png';
import Img3 from '@/assets/achievementsImg3.png';
import Img4 from '@/assets/achievementsImg4.png';
import GalleryCard from '@/components/Cards/GalleryCard';

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
    title: 'Students Trained Under GNA so far',
    number: '1500+',
    color: '#EEFAFF',
    textColor: '#1D6D8D',
  },
  {
    id: '2',
    title: 'Arangetram or Rangapravesha',
    number: '45+',
    color: '#FFEFEE',
    textColor: '#FF6F61',
  },
  {
    id: '3',
    title: 'Performance all over India',
    number: '738+',
    color: '#EEFAFF',
    textColor: '#1D6D8D',
  },
  {
    id: '4',
    title: 'Contries travelled',
    number: '13+',
    color: '#FFEFEE',
    textColor: '#FF6F61',
  },
];

const achievementsImages: string[] = [Img1, Img2, Img3, Img4];

const Achievements = () => {
  return (
    <div className="relative px-[120px] py-20">
      <div className="">
        <h1 className="text-[32px] font-semibold leading-[130%] tracking-[-1.5%]">
          Milestones & Achievements That Shaped Our Journey
        </h1>
        <p className="text-lg leading-[170%] tracking-[-1%]">
          A journey marked by{' '}
          <span className="font-semibold">
            national honors, artistic innovations,
          </span>{' '}
          and the nurturing of future torchbearers of Indian classical dance.
        </p>
      </div>
      <div
        className="relative mt-8 grid max-w-[1100px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
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
        className="absolute right-0 top-[190px]"
        src={handSign}
        alt="handsign"
        height={100}
        width={260}
      />
      <div className="my-12 grid grid-cols-2 place-content-between gap-8">
        <div className="rounded-2xl bg-[#EEFAFF] px-6 py-12">
          <ul className="list-outside list-disc space-y-6 pl-8">
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
        <div className="rounded-2xl bg-[#FFEFEE] px-6 py-12">
          <ul className="list-outside list-disc space-y-6 pl-8">
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
      <div className="flex gap-6">
        {achievementsImages.map((img) => (
          <GalleryCard key={img} img={img} />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
