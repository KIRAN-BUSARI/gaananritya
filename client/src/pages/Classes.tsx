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

import bharathanatyam from '@/assets/classes/bharathanatyam.png';
import kathak from '@/assets/classes/kathak.png';
import carnatic from '@/assets/classes/carnatic.png';
import { Button } from '@/components/ui/button';

const Classes = () => {
  return (
    <div className="relative flex h-auto w-full flex-col items-center justify-center">
      <div className="-z-10 max-h-40 w-full md:max-h-[500px]">
        <video
          src="https://res.cloudinary.com/djbkmezt7/video/upload/v1745645885/Untitled_design_nk3hv7.mp4"
          className="aspect-video w-full"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controls
        />
      </div>
      <div className="flex w-full flex-col bg-white px-4 py-8 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-20 lg:py-24">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl md:text-[32px]">
            Classes That Move with Grace & Melody
          </h1>
          <p className="mt-2 text-lg font-medium sm:text-xl md:text-2xl">
            Learn Bharatanatyam, Kathak & Carnatic Music — the traditional way,
            with a modern touch.
          </p>
        </div>
        <div className="mt-6 md:mt-9">
          <p className="text-base leading-[170%] tracking-[-0.18px] md:text-lg">
            At Gaana Nritya Academy, we offer structured and soulful training in
            Bharatanatyam, Kathak, and Carnatic vocal music for students of all
            ages. Under the expert guidance of renowned gurus, each class blends
            strong foundational techniques with expressive performance skills.
            Whether you're a beginner or an experienced learner, our
            step-by-step curriculum helps you grow with confidence. Experience
            the joy of Indian classical art forms in a nurturing environment,
            right from basic adavus and tatkars to advanced repertoire and stage
            presence.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:mt-12 md:gap-10 lg:grid-cols-3">
          {classList.map((data, index) => (
            <div key={index} className="w-full">
              <ClassesCard image={data.image} title={data.title} />
            </div>
          ))}
        </div>
        <div className="mt-6">
          {/* Bharatanatyam Section */}
          <div className="my-6 grid grid-cols-1 gap-6 rounded-2xl bg-[#EEFAFF] p-4 sm:my-10 sm:p-8 md:grid-cols-2 md:gap-10 md:p-14 lg:gap-20">
            <div className="order-1 mx-auto w-full max-w-[400px] md:max-w-none">
              <img
                src={bharathanatyam}
                alt="Bharatanatyam"
                className="h-auto w-full rounded-lg"
              />
            </div>
            <div className="order-2 py-2 md:py-4">
              <h1 className="text-2xl font-semibold leading-[130%] tracking-[-0.48px] md:text-[32px]">
                Bharatanatyam
              </h1>
              <p className="my-2 text-lg font-medium sm:text-xl">
                Grace in every step. Stories in every move.
              </p>
              <p className="mt-4 text-base leading-[170%] tracking-[-0.18px] sm:text-lg">
                Discover the soul of South Indian classical dance with our
                Bharatanatyam classes designed for all age groups. From basic
                adavus to intricate abhinaya and stage performances, students
                learn discipline, expression, and tradition in every session.
                Guided by experienced gurus, our curriculum nurtures both
                beginners and advanced learners into confident performers.
              </p>
              <Button
                variant={'secondary'}
                className="mt-6 w-full text-primary md:mt-9"
              >
                Join Now
              </Button>
            </div>
          </div>

          {/* Carnatic Music Section */}
          <div className="my-6 grid grid-cols-1 gap-6 p-4 sm:my-10 sm:p-8 md:grid-cols-2 md:gap-10 md:p-14 lg:gap-20">
            <div className="order-2 py-2 md:order-1 md:py-4">
              <h1 className="text-2xl font-semibold leading-[130%] tracking-[-0.48px] md:text-[32px]">
                Carnatic Music
              </h1>
              <p className="my-2 text-lg font-medium sm:text-xl">
                Tune into the rhythm of tradition.
              </p>
              <p className="mt-4 text-base leading-[170%] tracking-[-0.18px] sm:text-lg">
                Our Carnatic music classes offer a soulful journey into South
                Indian classical vocals. With a strong focus on sruti, laya, and
                raga development, students are trained to understand and
                appreciate the depth of classical compositions. From basic
                swaras to varnams and krithis, each learner gets personalized
                attention and structured growth.
              </p>
              <Button
                variant={'secondary'}
                className="mt-6 w-full text-primary md:mt-9"
              >
                Join Now
              </Button>
            </div>
            <div className="order-1 mx-auto w-full max-w-[400px] md:order-2 md:max-w-none">
              <img
                src={carnatic}
                alt="Carnatic Music"
                className="h-auto w-full rounded-lg"
              />
            </div>
          </div>

          {/* Kathak Section */}
          <div className="my-6 grid grid-cols-1 gap-6 rounded-2xl bg-[#FFEFEE] p-4 sm:my-10 sm:p-8 md:grid-cols-2 md:gap-10 md:p-14 lg:gap-20">
            <div className="order-1 mx-auto w-full max-w-[400px] md:max-w-none">
              <img
                src={kathak}
                alt="Kathak"
                className="h-auto w-full rounded-lg"
              />
            </div>
            <div className="order-2 py-2 md:py-4">
              <h1 className="text-2xl font-semibold leading-[130%] tracking-[-0.48px] md:text-[32px]">
                Kathak
              </h1>
              <p className="my-2 text-lg font-medium sm:text-xl">
                Where rhythm meets expression.
              </p>
              <p className="mt-4 text-base leading-[170%] tracking-[-0.18px] sm:text-lg">
                Step into the world of Kathak dance and experience the elegance
                of North Indian storytelling through footwork, spins, and
                gestures. Our Kathak classes blend tradition and creativity,
                helping students master both technical precision and emotive
                performance. Open to all levels, the program builds a strong
                foundation rooted in classical knowledge and performance
                artistry.
              </p>
              <Button
                variant={'secondary'}
                className="mt-6 w-full text-primary md:mt-9"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
