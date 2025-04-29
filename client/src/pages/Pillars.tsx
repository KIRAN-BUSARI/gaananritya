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
    description:
      'A cornerstone of Gaana Nritya Academy, Mr. Radha Krishna elevates our performances through.',
  },
  {
    image: img1,
    name: 'Ankita K',
    description:
      'A cornerstone of Gaana Nritya Academy, Mr. Radha Krishna elevates our performances through.',
  },
  {
    image: img1,
    name: 'Poorvi Radhakrishna',
    description:
      'A cornerstone of Gaana Nritya Academy, Mr. Radha Krishna elevates our performances through.',
  },
  {
    image: img1,
    name: 'Mr. Radhakrishna Bhat',
    description:
      'A cornerstone of Gaana Nritya Academy, Mr. Radha Krishna elevates our performances through.',
  },
  {
    image: img1,
    name: 'Mr. Radhakrishna Bhat',
    description:
      'A cornerstone of Gaana Nritya Academy, Mr. Radha Krishna elevates our performances through.',
  },
  {
    image: img1,
    name: 'Mr. Radhakrishna Bhat',
    description:
      'A cornerstone of Gaana Nritya Academy, Mr. Radha Krishna elevates our performances through.',
  },
];

const Pillars = () => {
  return (
    <div className="mx-auto flex flex-col px-20 py-20">
      <div className="">
        <h1 className="font-semibold leading-[130%] tracking-[-1.5%] sm:text-2xl lg:text-[32px]">
          Pillars & Strength of Gaana Nritya Academy
        </h1>
        <p className="mt-4 text-lg font-medium leading-[170%] tracking-[-1%] sm:text-base lg:text-lg">
          Meet the dedicated artists and senior students who uphold Gaana Nritya
          Academy&apos;s legacy, nurturing talent and leading our branches.
        </p>
      </div>
      <div className="mt-10 grid gap-12 lg:grid-cols-3">
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
