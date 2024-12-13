import { motion } from 'framer-motion';
import AwardCard from '@/components/Cards/AwardCard';

const awards = [
  {
    id: 1,
    title: 'Bharath Siri',
    description:
      'National Award for Bharathantyam Ajantha Cultural Association, Bangalore, 2012 State Award.',
  },
  {
    id: 2,
    title: 'Karnataka Siri',
    description:
      'National Award for Yoga Ajantha Cultural Association, Bangalore, 2012',
  },
  {
    id: 3,
    title: 'Janapada Siri',
    description: 'Kuvempu university - 2024',
  },
  {
    id: 4,
    title: 'Abhinandana Puraskara',
    description: 'Brahmana Sangha, Thirthahalli – 14-09-2003',
  },
  {
    id: 5,
    title: 'Kishore Prathibhe',
    description: 'Kannada & Samskruthi Ilakhe - 2001',
  },
  {
    id: 6,
    title: 'Best Actress Award',
    description: 'For Dance Drama vevnu visarjane',
  },
];

const AwardsPage = () => {
  return (
    <div
      id="awards"
      className="flex min-h-screen flex-col items-center justify-center bg-secondary px-4 py-10 md:px-[120px]"
    >
      {/* Title and description animation */}
      <motion.div
        className="mx-auto mb-5 flex flex-col space-y-2 text-center text-white"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-left text-2xl font-semibold sm:text-center md:text-4xl">
          Awards & Achievements
        </h1>
        <p className="text-left text-sm font-normal leading-[22px] sm:text-center md:text-base">
          Discover the remarkable achievements and recognition of our Indian
          classical dance artists, who have received prestigious{' '}
          <br className="hidden md:block" /> awards and accolades for their
          exceptional talent and contribution to this art form
        </p>
      </motion.div>

      {/* Awards grid with motion */}
      <motion.div
        className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:gap-10"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        {awards.map((award) => (
          <motion.div
            key={award.id}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <AwardCard title={award.title} description={award.description} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AwardsPage;
