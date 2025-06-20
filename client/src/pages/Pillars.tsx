import img1 from '@/assets/pillars/faculty1.webp';
import img2 from '@/assets/pillars/faculty2.webp';
import img3 from '@/assets/pillars/faculty3.webp';
import img5 from '@/assets/pillars/faculty4.webp';
import img7 from '@/assets/pillars/faculty5.webp';
import img8 from '@/assets/pillars/faculty6.webp';

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
      "A dedicated cultural enthusiast and passionate arts administrator, Radhakrishna Bhat has been an integral part of Gaana Nritya Academy's growth journey.",
    color: '#FFF6F5',
  },
  {
    image: img7,
    name: 'Vidushi Manjushree Raghav',
    designation: 'Faculty - Bharatanatya',
    description:
      'Manjushree Raghav, a Mangalore-born Bharatanatyam dancer with a Vidwat certification, has trained for over 20 years under Guru Vidushi Vidyashree Radhakrishna.',
    color: '#F3FBFF',
  },
  {
    image: img5,
    name: 'Vidushi Ankitha Rai Pranam',
    designation: 'Faculty - Bharatanatya',
    description:
      'Vidushi Ankitha Rai Pranam has been learning Bharatanatyam under Guru Vidyashree Radhakrishna for 21 years, completing her Vidwat in 2017.',
    color: '#F3FBFF',
  },
  {
    image: img2,
    name: 'Vidushi Bindiya Prathik',
    designation: 'Faculty - Bharathantyam',
    description:
      'Vidushi Smt. Bindiya Prathik has been learning under Guru Vidyashree Radhakrishna and currently  managing GNA’s branch in Gurunagar, Padavinangady.',
    color: '#FFF6F5',
  },
  {
    image: img3,
    name: 'Vidwan Krishnacharya Bantwal',
    designation: 'Faculty - Carnatic Vocal',
    description:
      'Shri Krishnacharya, a Vidwat-qualified Carnatic vocalist and composer, has performed extensively and led music for over 25 Bharatanatyam troupes.',
    color: '#FFF6F5',
  },
  {
    image: img8,
    name: 'Vidushi Teena Chethan Poombady',
    designation: 'Faculty - Bharatanatya',
    description:
      'Teena Chethan Poombady, a Mysore-born Bharatanatyam dancer with over 15 years of experience, holds a “Vidwath” in dance and has trained under renowned gurus.',
    color: '#F3FBFF',
  },
];

const Pillars = () => {
  return (
    <div className="mx-auto flex flex-col px-4 py-12 sm:px-6 md:px-10 lg:px-20 lg:py-20">
      <div className="mx-auto w-full text-left">
        <h1 className="text-[32px] font-semibold leading-[130%] tracking-[-1.5%]">
          Faculty of Gaana Nritya Academy
        </h1>
        <p className="mt-2 text-balance text-left text-lg leading-[170%] tracking-[-1%] text-[#2b2b2e]">
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
