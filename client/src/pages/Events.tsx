import ClassesCard from '@/components/Cards/ClassesCard';

import img1 from '@/assets/classes/img1.png';
import img2 from '@/assets/classes/img2.png';
import img3 from '@/assets/classes/img3.png';

const classList = [
  {
    image: img1,
    title: 'Bharatanatyam',
  },
  {
    image: img2,
    title: 'Kathak',
  },
  {
    image: img3,
    title: 'Carnatic Music',
  },
];

const Events = () => {
  return (
    <div className="relative flex h-auto w-full flex-col items-center justify-center">
      <div className="-z-10 -m-9 max-h-64 w-full md:-m-28 md:max-h-[700px]">
        <video
          src="https://res.cloudinary.com/djbkmezt7/video/upload/v1745867383/Untitled_design_fiafpr.mp4"
          className="aspect-video w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </div>
      <div className="flex w-full flex-col bg-white px-4 py-8 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-20 lg:py-24">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl md:text-[32px]">
            Events that Celebrate Tradition & Talent
          </h1>
          <p className="mt-2 text-lg font-medium sm:text-xl md:text-2xl">
            From graceful performances to grand festivals — experience the
            rhythm of GNA on stage.
          </p>
        </div>
        <div className="mt-6 md:mt-9">
          <p className="text-base leading-[170%] tracking-[-0.18px] md:text-lg">
            Every event is a celebration of art, culture, and community. Our
            calendar is filled with enriching performances, vibrant festivals,
            and student showcases that bring classical dance and music to
            diverse audiences. Whether it’s a quiet auditorium or a grand temple
            stage, our dancers and musicians leave an impression wherever they
            perform. Stay updated with our upcoming events or revisit the
            moments that moved hearts.
          </p>
        </div>
        <div className="mt-8">
          <h1 className="text-2xl font-semibold leading-[170%] tracking-[-1%] text-[#FF6F61]">
            Upcoming Events
          </h1>
          <ul className="mt-6 list-inside list-disc space-y-4 text-lg">
            <li>
              Celebrating{' '}
              <span className="font-semibold text-[#FF6F61]">
                Aaronhan-2025{' '}
              </span>{' '}
              at Sullia Branch, Mangalore - Invitation
            </li>
            <li>
              <span className="font-semibold text-[#FF6F61]">
                Poorvi Radhakrishna&apos;s Rangapravesh
              </span>{' '}
              on 12th May 2025, Mangalore.
            </li>
            <li>
              Annual Day Celebration{' '}
              <span className="font-semibold text-[#FF6F61]">Hejje-Gejje,</span>{' '}
              25th June, Gaana Nritya Academy, Branch Bangalore.
            </li>
          </ul>
        </div>
        <div className="mt-16">
          <h1 className="text-2xl font-semibold leading-[170%] tracking-[-1%]">
            Past Events
          </h1>
          <ul className="mt-6 list-inside list-disc space-y-4 text-lg">
            <li>
              Celebrating{' '}
              <span className="font-semibold text-[#FF6F61]">
                Aaronhan-2025{' '}
              </span>{' '}
              at Sullia Branch, Mangalore - Invitation
            </li>
            <li>
              <span className="font-semibold text-[#FF6F61]">
                Poorvi Radhakrishna&apos;s Rangapravesh
              </span>{' '}
              on 12th May 2025, Mangalore.
            </li>
            <li>
              Annual Day Celebration{' '}
              <span className="font-semibold text-[#FF6F61]">Hejje-Gejje,</span>{' '}
              25th June, Gaana Nritya Academy, Branch Bangalore.
            </li>
          </ul>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:mt-12 md:gap-10 lg:grid-cols-3">
          {classList.map((data, index) => (
            <div key={index} className="w-full">
              <ClassesCard image={data.image} title={data.title} />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h1 className="text-2xl font-semibold leading-[170%] tracking-[-1%] text-[#FF6F61]">
            Festivals
          </h1>
          <ul className="mt-6 list-inside list-disc space-y-4 text-lg">
            <li>
              Celebrating{' '}
              <span className="font-semibold text-[#FF6F61]">
                Aaronhan-2025{' '}
              </span>{' '}
              at Sullia Branch, Mangalore - Invitation
            </li>
            <li>
              <span className="font-semibold text-[#FF6F61]">
                Poorvi Radhakrishna&apos;s Rangapravesh
              </span>{' '}
              on 12th May 2025, Mangalore.
            </li>
            <li>
              Annual Day Celebration{' '}
              <span className="font-semibold text-[#FF6F61]">Hejje-Gejje,</span>{' '}
              25th June, Gaana Nritya Academy, Branch Bangalore.
            </li>
          </ul>
        </div>
        <div className="mt-16">
          <h1 className="text-2xl font-semibold leading-[170%] tracking-[-1%]">
            Productions
          </h1>
          <ul className="mt-6 list-inside list-disc space-y-4 text-lg">
            <li>
              Celebrating{' '}
              <span className="font-semibold text-[#FF6F61]">
                Aaronhan-2025{' '}
              </span>{' '}
              at Sullia Branch, Mangalore - Invitation
            </li>
            <li>
              <span className="font-semibold text-[#FF6F61]">
                Poorvi Radhakrishna&apos;s Rangapravesh
              </span>{' '}
              on 12th May 2025, Mangalore.
            </li>
            <li>
              Annual Day Celebration{' '}
              <span className="font-semibold text-[#FF6F61]">Hejje-Gejje,</span>{' '}
              25th June, Gaana Nritya Academy, Branch Bangalore.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Events;
