import { motion } from 'framer-motion';
// import img1 from '@/assets/events/img1.png';
// import img2 from '@/assets/events/img2.png';
// import img3 from '@/assets/events/img3.png';
// import img4 from '@/assets/events/img4.png';
import { useCallback, useEffect, useState, useMemo } from 'react';
import EventCard from '@/components/Cards/EventCard';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  CalendarIcon,
  FilmIcon,
  PartyPopperIcon,
  HistoryIcon,
  ArrowDown,
  StarIcon,
} from 'lucide-react';

interface Tab {
  title: string;
}

// List of significant performances
const significantPerformances = [
  'Guruvandana under the tutelage of Guru Shri Muralidhar Rao, Mysuru',
  'Subrahmanya Temple – Kirushashtiuthsava',
  'Shree Bhramaramba Temple - Kateeluthsava',
  'Kannada Sangha Matunga, Mumbai',
  'Sadhanasangama-Yugala, Bengaluru',
  "Alva's Nudisiri, Moodabidire, Dakshina Kannada",
  'Samanvaya, Bharatanatyam and Odissi Jugalbandi with Smt. Madhulita Mohapatra',
  'Nrityakala Parishad, Mysuru',
  'Mysuru Dasara',
  'Dance Festivals - Karwar and Kaiga',
  'Karavali Uthsava, Mangaluru',
  'Lakshadeepothsava, Shri Manjunatheshwara Temple, Dharmasthala',
  'Naadaneerajanam, Tirupathi',
  'Golden Temple, Vellore',
  'Nrityantar Festival, Bengaluru',
  'Buntayana, Kuwait',
  'Dance Festival, Kollur Mookambika Temple',
  'Kadambotsava, Banavasi',
  'Dance Festival, Guruvayur Temple',
  'Paryaya Uthsava, Shri Krishna Temple, Udupi',
  'Hampi Utsava',
  'Puligere Utsava',
  'Kannada Sangha, New Delhi',
  'Natyanjali Tirunagai and Thirunallar of Tamilnadu',
  'Karthik Fine Arts, Chennai',
  'Twice at Nehru centre, London, UK',
  'SARANG Festival at South Korea, sponsored by ICCR, Ministry of Culture',
  'Ashtabhavika presentation by the disciples of Guru Rama Vaidyanathan, Bengaluru and Mumbai.',
];

// List of productions
const productionsList = [
  'Solo and group performances [classical, semi classical and folk]',
  'Solo thematic performances',
  'DANCE BALLET',
  'Satyameva Jayate',
  'Jwalamukhi Ambe',
  'Srinivasa Kalyana',
  'Virata Parva',
  'Nartana Parivartana',
  'Rutu Sringara',
  'Dashaavataara',
  'Kannada Sahitya Nritya Vaibhava',
  'Navarasa Ramaayana',
];

const tabs: Tab[] = [
  { title: 'Upcoming Events' },
  { title: 'Productions' },
  // { title: 'Festivals' },
  // { title: 'Past Events' },
  { title: 'Significant Performances' },
];

const eventsData = [
  {
    id: 1,
    // image: img1,
    category: 'Upcoming Events',
    title: 'Annual Dance Festival 2025 - Arohana Part 1',
    date: '24-08-2025',
    location: 'Mangalore',
    timings: '5:00 PM',
  },
  {
    id: 2,
    // image: img4,
    category: 'Upcoming Events',
    title: 'Annual Dance Festival 2025 - Arohana Part 2',
    date: '07-09-2025',
    location: 'Mangalore',
    timings: '5:00 PM',
  },
  {
    id: 3,
    // image: img2,
    category: 'Upcoming Events',
    title: 'Bharathanatya Rangapravesha - Anantha Krishna',
    date: '26-10-2025',
    location: 'Mangalore',
    timings: '4:00 PM',
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

  // Render the significant performances list
  const renderSignificantPerformances = () => {
    return (
      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl md:text-2xl">
            Significant Performances
          </h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Gaana Nritya Academy has performed at prestigious venues and events
            across India and internationally. Here are some of our notable
            performances:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          {significantPerformances.map((performance, index) => (
            <motion.div
              key={index}
              className="flex items-start rounded-md bg-gradient-to-r from-secondary/5 to-transparent px-3 py-3 transition-all hover:from-secondary/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="mr-3 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-secondary"></div>
              <p className="text-sm leading-relaxed sm:text-base">
                {performance}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Render the productions list
  const renderProductions = () => {
    return (
      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl md:text-2xl">
            Productions
          </h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Gaana Nritya Academy presents a diverse range of classical and
            contemporary dance productions, from solo performances to elaborate
            dance ballets that bring mythological and cultural stories to life.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          {productionsList.map((production, index) => (
            <motion.div
              key={index}
              className="flex items-start rounded-md bg-gradient-to-r from-secondary/5 to-transparent px-3 py-3 transition-all hover:from-secondary/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="mr-3 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-secondary"></div>
              <p className="text-sm leading-relaxed sm:text-base">
                {production}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

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

    // Show significant performances list when that filter is active
    if (filter === 'Significant Performances') {
      return renderSignificantPerformances();
    }

    // Show productions list when that filter is active
    if (filter === 'Productions') {
      return renderProductions();
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
            className="mt-2 rounded-md bg-secondary px-2 py-2 text-sm font-medium text-primary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            View all events
          </button>
        </div>
      );
    }

    return (
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
              // image={event.image}
              title={event.title}
              location={event.location}
              date={event.date}
              timings={event.timings}
              category={event.category}
              showCategoryLabel={filter === 'All Events'}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const iconMap: Record<string, JSX.Element> = {
    'All Events': <ArrowDown className="mr-2 h-4 w-4" />,
    'Upcoming Events': <CalendarIcon className="mr-2 h-4 w-4" />,
    Productions: <FilmIcon className="mr-2 h-4 w-4" />,
    Festivals: <PartyPopperIcon className="mr-2 h-4 w-4" />,
    'Past Events': <HistoryIcon className="mr-2 h-4 w-4" />,
    'Significant Performances': <StarIcon className="mr-2 h-4 w-4" />,
  };

  return (
    <div className="relative flex h-auto w-full flex-col items-center justify-center">
      <div className="-z-10 max-h-40 w-full md:max-h-[400px] 2xl:max-h-[500px]">
        <video
          src="https://res.cloudinary.com/djbkmezt7/video/upload/v1745476384/WEBSITE_1_etlc3p.mp4"
          className="-mt-10 aspect-video w-full object-cover md:-mt-60"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </div>
      <div className="mb-10 flex w-full flex-col bg-white px-4 pt-10 md:mb-20 md:px-20">
        <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-[32px]">
          Events that Celebrate Tradition & Talent
        </h1>
        <p className="mt-2 text-base font-medium sm:text-lg md:text-xl lg:text-2xl">
          From graceful performances to grand festivals — experience the rhythm
          of GNA on stage.
        </p>

        <p className="mt-4 text-sm leading-relaxed tracking-[-0.18px] sm:text-base md:text-lg">
          Every event is a celebration of art, culture, and community. Our
          calendar is filled with enriching performances, vibrant festivals, and
          student showcases that bring classical dance and music to diverse
          audiences.
        </p>

        {/* Mobile Dropdown */}
        <div className="mt-6 sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer justify-end">
                {iconMap[filter] || <ArrowDown className="mr-2 h-4 w-4" />}
                {filter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {[{ title: 'All Events' }, ...tabs].map((tab) => (
                <DropdownMenuItem
                  key={tab.title}
                  onClick={() => handleFilterChange(tab.title)}
                  className="flex items-center"
                >
                  {iconMap[tab.title]}
                  {tab.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Tabs */}
        <div className="mt-6 hidden flex-wrap items-center gap-2 sm:flex lg:gap-4">
          {[{ title: 'All Events' }, ...tabs].map((tab) => (
            <button
              key={tab.title}
              onClick={() => handleFilterChange(tab.title)}
              className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 sm:text-sm md:px-5 md:py-2.5 lg:px-2 lg:py-2 lg:text-base ${
                filter === tab.title
                  ? 'border-secondary bg-secondary text-primary'
                  : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-100'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="mt-8">{renderContent()}</div>

        {/* Upcoming Events Section */}
        {filter === 'All Events' && (
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl md:text-2xl">
              Upcoming Highlights
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm sm:mt-6 sm:space-y-3 sm:text-base md:space-y-4 md:text-lg">
              <li>
                Celebrating{' '}
                <span className="font-semibold text-secondary1">
                  Aaronhan-2025
                </span>{' '}
                at Sullia Branch, Mangalore
              </li>
              <li>
                <span className="font-semibold text-secondary1">
                  Poorvi Radhakrishna&apos;s Rangapravesh
                </span>{' '}
                on 12th May 2025, Mangalore.
              </li>
              <li>
                Annual Day Celebration{' '}
                <span className="font-semibold text-secondary1">
                  Hejje-Gejje
                </span>
                , 25th June, Gaana Nritya Academy, Branch Bangalore.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
