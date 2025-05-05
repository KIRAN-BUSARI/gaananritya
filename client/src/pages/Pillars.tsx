import img1 from '@/assets/pillars/faculty1.png';
import img2 from '@/assets/pillars/faculty2.png';
import img3 from '@/assets/pillars/faculty3.png';
import img5 from '@/assets/pillars/faculty5.png';
import img6 from '@/assets/pillars/faculty6.png';
import img7 from '@/assets/pillars/faculty7.png';
import img8 from '@/assets/pillars/faculty8.png';

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
      "A dedicated cultural enthusiast and passionate arts administrator, Radhakrishna Bhat has been an integral part of Gaana Nritya Academy's growth journey. With over a decade of experience in organizational management, he ensures the smooth execution of events, performances, and academic coordination. His commitment to promoting Indian classical arts, especially in rural and underrepresented communities, reflects in every initiative led by the academy. Known for his discipline and warmth, he bridges the gap between tradition and innovation in his role as Secretary.",
    color: '#FFF6F5',
  },
  {
    image: img2,
    name: 'Vidushi Bindiya Prathik',
    designation: 'Faculty - Bharathantyam',
    description:
      'Shri Krishnacharya, a Vidwat-qualified Carnatic vocalist and composer, has performed extensively and led music for over 25 Bharatanatyam troupes. Founder of Keertana Sangeet Shale (2003), he mentors 250+ students in Bantwal both offline and online.',
    color: '#F3FBFF',
  },
  {
    image: img3,
    name: 'Vidwan Krishnacharya Bantwal',
    designation: 'Faculty - Carnatic Music',
    description:
      'Shri Krishnacharya, a Vidwat-qualified Carnatic vocalist and composer, has performed extensively and led music for over 25 Bharatanatyam troupes.',
    color: '#F3FBFF',
  },
  {
    image: img5,
    name: 'Vidushi Ankitha Rai Pranam',
    designation: 'Faculty - Carnatic Music',
    description:
      'Vidushi Ankitha Rai Pranam has been learning Bharatanatyam under Guru Vidyashree Radhakrishna for 21 years, completing her Vidwat and Rangapravesha in 2017.',
    color: '#FFF6F5',
  },
  {
    image: img6,
    name: 'Vidushi Rajatha Krishacharya',
    designation: 'Faculty - Carnatic Music',
    description:
      'A seasoned Carnatic vocalist and composer, Shri Krishnacharya began his musical journey under his father Ramacharya and later trained with maestros.',
    color: '#FFF6F5',
  },
  {
    image: img7,
    name: 'Vidushi Manjushree Raghav',
    designation: 'Faculty - Carnatic Music',
    description:
      'Manjushree Raghav, a Mangalore-born Bharatanatyam dancer with a Vidwat certification, has trained for over 20 years under Guru Vidushi Vidyashree Radhakrishna.',
    color: '#F3FBFF',
  },
  {
    image: img8,
    name: 'Vidushi Teena Chethan Poombady',
    designation: 'Faculty - Carnatic Music',
    description:
      'Teena Chethan Poombady, a Mysore-born Bharatanatyam dancer with over 15 years of experience, holds a “Vidwath” in dance and has trained under renowned gurus.',
    color: '#F3FBFF',
  },
];

const Pillars = () => {
  return (
    <div className="mx-auto flex flex-col px-4 py-12 sm:px-6 md:px-10 lg:px-20 lg:py-20">
      <div className="mx-auto w-full text-center sm:text-left">
        <h1 className="text-2xl font-semibold leading-[130%] tracking-[-1.5%] sm:text-3xl lg:text-[32px]">
          Pillars & Strength of Gaana Nritya Academy
        </h1>
        <p className="mt-3 max-w-4xl text-sm font-medium leading-[170%] tracking-[-1%] sm:text-base md:mt-4 md:text-lg">
          Meet the dedicated artists and senior students who uphold Gaana Nritya
          Academy's legacy, nurturing talent and leading our branches.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:mt-16 md:grid-cols-2 md:gap-8 lg:gap-10">
        {pillarsData.map((pillar, index) => (
          <PillarsCard
            key={index}
            image={pillar.image}
            name={pillar.name}
            designation={pillar.designation}
            description={pillar.description}
            color={pillar.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Pillars;
