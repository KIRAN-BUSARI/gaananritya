import { motion } from 'framer-motion';

import img1 from '@/assets/classes/img1.png';
import img2 from '@/assets/classes/img2.png';
import img3 from '@/assets/classes/img3.png';
import { useCallback, useEffect, useState, useMemo } from 'react';
import EventCard from '@/components/Cards/EventCard';

interface Tab {
  title: string;
}

const tabs: Tab[] = [
  { title: 'Upcoming Events' },
  { title: 'Productions' },
  { title: 'Festivals' },
  { title: 'Past Events' },
];

const eventsData = [
  {
    id: 1,
    image: img1,
    category: 'Upcoming Events',
    title: 'Annual Dance Festival 2025',
    date: '12-05-2025',
    location: 'Mangalore',
    timings: '4:00 PM',
  },
  {
    id: 2,
    image: img2,
    category: 'Festivals',
    title: 'Navaratri Special',
    date: '15-10-2025',
    location: 'Bangalore',
    timings: '6:00 PM',
  },
  {
    id: 3,
    image: img3,
    category: 'Productions',
    title: 'Bharatanatyam Arangetram',
    date: '22-06-2025',
    location: 'Mysore',
    timings: '5:30 PM',
  },
  {
    id: 4,
    image: img1,
    category: 'Past Events',
    title: 'Kathak Workshop',
    date: '10-01-2025',
    location: 'Bangalore',
    timings: '10:00 AM',
  },
];

const Events = () => {
  const [filter, setFilter] = useState<string>('All Events');
  const [isLoading, setIsLoading] = useState(true);

  const handleFilterChange = useCallback((category: string) => {
    setFilter(category);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      return filter === 'All Events' || event.category === filter;
    });
  }, [filter]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-40 w-full items-center justify-center py-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-secondary"></div>
            <p className="text-gray-600">Loading Events...</p>
          </div>
        </div>
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <div className="flex h-40 w-full flex-col items-center justify-center space-y-3 py-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No events found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try selecting a different category
            </p>
          </div>
          <button
            onClick={() => {
              setFilter('All Events');
            }}
            className="mt-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            View all events
          </button>
        </div>
      );
    }

    return (
      <>
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <EventCard
                image={event.image}
                title={event.title}
                location={event.location}
                date={event.date}
                timings={event.timings}
                category={event.category}
                showCategoryLabel={filter === 'All Events'} // Only show category label when "All Events" is selected
              />
            </motion.div>
          ))}
        </motion.div>
      </>
    );
  };

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
          <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-[32px]">
            Events that Celebrate Tradition & Talent
          </h1>
          <p className="mt-2 text-base font-medium sm:text-lg md:text-xl lg:text-2xl">
            From graceful performances to grand festivals — experience the
            rhythm of GNA on stage.
          </p>
        </div>
        <div className="mt-4 md:mt-6 lg:mt-9">
          <p className="text-sm leading-relaxed tracking-[-0.18px] sm:text-base md:text-lg">
            Every event is a celebration of art, culture, and community. Our
            calendar is filled with enriching performances, vibrant festivals,
            and student showcases that bring classical dance and music to
            diverse audiences. Whether it's a quiet auditorium or a grand temple
            stage, our dancers and musicians leave an impression wherever they
            perform. Stay updated with our upcoming events or revisit the
            moments that moved hearts.
          </p>
        </div>
        <div className="mt-6 sm:mt-8 lg:mt-10">
          <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8 md:mb-10 lg:mb-12 lg:gap-4">
            <div className="scrollbar-hide flex w-full gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:pb-0 lg:gap-4">
              {[{ title: 'All Events' }, ...tabs].map((tab) => (
                <button
                  key={tab.title}
                  onClick={() => handleFilterChange(tab.title)}
                  className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 sm:text-sm md:px-5 md:py-2.5 lg:px-4 lg:py-2 lg:text-base ${
                    filter === tab.title
                      ? 'border-secondary bg-secondary text-primary'
                      : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>

          {renderContent()}
        </div>

        {/* Only show section labels when filter is "All Events" */}
        {filter === 'All Events' && (
          <div className="mt-8 space-y-12 sm:mt-12 lg:mt-16">
            <div>
              <h2 className="text-xl font-semibold leading-[170%] tracking-[-1%] text-[#FF6F61] sm:text-2xl">
                Upcoming Events
              </h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm sm:mt-6 sm:space-y-3 sm:text-base md:space-y-4 md:text-lg">
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
                  <span className="font-semibold text-[#FF6F61]">
                    Hejje-Gejje,
                  </span>{' '}
                  25th June, Gaana Nritya Academy, Branch Bangalore.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold leading-[170%] tracking-[-1%] sm:text-2xl">
                Past Events
              </h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm sm:mt-6 sm:space-y-3 sm:text-base md:space-y-4 md:text-lg">
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
                  <span className="font-semibold text-[#FF6F61]">
                    Hejje-Gejje,
                  </span>{' '}
                  25th June, Gaana Nritya Academy, Branch Bangalore.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold leading-[170%] tracking-[-1%] text-[#FF6F61] sm:text-2xl">
                Festivals
              </h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm sm:mt-6 sm:space-y-3 sm:text-base md:space-y-4 md:text-lg">
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
                  <span className="font-semibold text-[#FF6F61]">
                    Hejje-Gejje,
                  </span>{' '}
                  25th June, Gaana Nritya Academy, Branch Bangalore.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold leading-[170%] tracking-[-1%] sm:text-2xl">
                Productions
              </h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm sm:mt-6 sm:space-y-3 sm:text-base md:space-y-4 md:text-lg">
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
                  <span className="font-semibold text-[#FF6F61]">
                    Hejje-Gejje,
                  </span>{' '}
                  25th June, Gaana Nritya Academy, Branch Bangalore.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
