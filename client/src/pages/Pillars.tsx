import img1 from '@/assets/pillars/faculty1.png';
import img3 from '@/assets/pillars/faculty3.png';

import PillarsCard from '@/components/Cards/PillarsCard';
interface PillarData {
  image: string;
  name: string;
  designation: string;
  description: string;
  color?: string;
}

const pillarsData: PillarData[] = [
  {
    image: img1,
    name: 'Radhakrishna Bhat',
    designation: 'Secretary – Gaana Nritya Academy',
    description:
      'A dedicated cultural enthusiast and passionate arts administrator, Radhakrishna Bhat has been an integral part of Gaana Nritya Academy’s growth journey. With over a decade of experience in organizational management, he ensures the smooth execution of events, performances, and academic coordination. His commitment to promoting Indian classical arts, especially in rural and underrepresented communities, reflects in every initiative led by the academy. Known for his discipline and warmth, he bridges the gap between tradition and innovation in his role as Secretary.',
    color: '#FFF6F5',
  },
  {
    image: img1,
    name: 'Vidushi Bindiya Prathik',
    designation: 'Faculty - Bharathantyam, GNA’s Mangaluru Branches',
    description:
      'A seasoned Carnatic vocalist and composer, Shri Krishnacharya began his musical journey under his father Ramacharya and later trained with maestros like B. Somasunder Rao and Kanchana Subbaratnam. He holds a Vidwat qualification and has performed widely, including on Mangalore AIR. As the lead vocalist for over 25 Bharatanatyam troupes, he has also composed music for several dance productions. In 2003, he founded Keertana Sangeet Shale in Bantwal, where he and his wife now mentor 250+ students both offline and online.',
    color: '#F3FBFF',
  },
  {
    image: img3,
    name: 'Vidwan Krishnacharya Bantwal',
    designation: 'Faculty - Carnatic Music',
    description:
      'A seasoned Carnatic vocalist and composer, Shri Krishnacharya began his musical journey under his father Ramacharya and later trained with maestros like B. Somasunder Rao and Kanchana Subbaratnam. He holds a Vidwat qualification and has performed widely, including on Mangalore AIR. As the lead vocalist for over 25 Bharatanatyam troupes, he has also composed music for several dance productions. In 2003, he founded Keertana Sangeet Shale in Bantwal, where he and his wife now mentor 250+ students both offline and online.',
    color: '#FFF6F5',
  },
  {
    image: img3,
    name: 'Vidushi Manjushree Raghav',
    designation: 'Faculty - Bharathantyam, GNA Sulya',
    description:
      'A seasoned Carnatic vocalist and composer, Shri Krishnacharya began his musical journey under his father Ramacharya and later trained with maestros like B. Somasunder Rao and Kanchana Subbaratnam. He holds a Vidwat qualification and has performed widely, including on Mangalore AIR. As the lead vocalist for over 25 Bharatanatyam troupes, he has also composed music for several dance productions. In 2003, he founded Keertana Sangeet Shale in Bantwal, where he and his wife now mentor 250+ students both offline and online.',
    color: '#F3FBFF',
  },
];

const Pillars = () => {
  return (
    <div className="mx-auto flex flex-col px-2 py-20 sm:px-6 md:px-10 lg:px-20 lg:py-20">
      <div className="mx-auto text-center md:mx-0 md:text-left">
        <h1 className="text-left text-3xl font-semibold leading-[130%] tracking-[-1.5%] sm:text-2xl lg:text-[32px]">
          Pillars & Strength of Gaana Nritya Academy
        </h1>
        <p className="mt-3 max-w-4xl text-left text-base font-medium leading-[170%] tracking-[-1%] sm:text-lg md:mt-4 md:text-lg">
          Meet the dedicated artists and senior students who uphold Gaana Nritya
          Academy's legacy, nurturing talent and leading our branches.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:gap-12">
        {pillarsData.map((pillar, index) => (
          <PillarsCard
            key={index}
            image={pillar.image}
            name={pillar.name}
            designation={pillar.designation}
            description={pillar.description}
            color={pillar.color}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Pillars;
