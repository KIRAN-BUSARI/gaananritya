import img1 from '@/assets/carousal1.png';
import PillarsCard from '@/components/Cards/PillarsCard';
interface PillarData {
  image: string;
  name: string;
  description: string;
}

const pillarsData: PillarData[] = [
  {
    image: img1,
    name: 'Mr. Radhakrishna Bhat',
    description: 'A cornerstone ',
  },
  {
    image: img1,
    name: 'Ankita K',
    description: 'A cornerstone ',
  },
  {
    image: img1,
    name: 'Poorvi Radhakrishna',
    description: 'A cornerstone ',
  },
  {
    image: img1,
    name: 'Mr. Radhakrishna Bhat',
    description: 'A cornerstone ',
  },
  {
    image: img1,
    name: 'Mr. Radhakrishna Bhat',
    description: 'A cornerstone ',
  },
  {
    image: img1,
    name: 'Mr. Radhakrishna Bhat',
    description: 'A cornerstone ',
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
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-10 md:gap-10 lg:grid-cols-4 lg:gap-12">
        {pillarsData.map((pillar, index) => (
          <PillarsCard
            key={index}
            image={pillar.image}
            name={pillar.name}
            description={pillar.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Pillars;
