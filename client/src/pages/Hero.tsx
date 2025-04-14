import { Button } from '@/components/ui/button.tsx';

export default function Hero() {
  return (
    <div id="" className="bg-image relative mx-auto h-auto px-[120px]">
      <div className="relative flex h-[90vh] items-center">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-[40px] font-medium leading-[130%] tracking-[-1.5px] text-primary">
            Celebrating 30 Years of <br /> Nurturing Dreams Through <br />{' '}
            Indian Music & Dance <br />{' '}
            <span className="text-secondary">Gaana Nritya Academy</span>
          </h1>
          <div className="mt-2">
            <p className="text-xl font-normal leading-[30px] text-primary">
              Spreading the Joy of Art to Generations Across <br /> Cities and
              Rural Communities{' '}
              <span className="text-secondary">Since 1994.</span>
            </p>
          </div>
          <div className="mt-8 space-x-6">
            <Button className="rounded-[8px] bg-secondary px-8 py-2 text-xl text-[#FAFAFA]">
              Clasees
            </Button>
            <Button className="hover:none border border-[#1D6D8D] bg-black px-8 py-2 text-xl text-[#FAFAFA]">
              Achievements
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
