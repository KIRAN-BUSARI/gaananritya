import bharathanatyam from '@/assets/classes/bharathanatyam.png';
import kathak from '@/assets/classes/kathak.png';
import carnatic from '@/assets/classes/carnatic.png';
import workshop from '@/assets/classes/workshop.png';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import AddressCard from '@/components/Cards/AddressCard';
import { Link } from 'react-router-dom';
import { useScrollToHash } from '@/lib/utils';

const addressList = [
  {
    id: 1,
    city: 'Mangalore, Main Branch',
    name: 'Gaana-Nritya Academy',
    address: [
      '4, 142/2 (6) – Tharangini,',
      'Malemar Road, Kottara Chowki,',
      'Mangalore – 575006,',
      'Karnataka, India',
    ],
    phoneNumber: '9844481158 (Whatsapp Only), 9449244843',
  },
  {
    id: 2,
    city: 'Sullia',
    name: 'Gaana-Nritya Academy',
    address: [
      'Yuva Jana Samyukta Mandali,',
      'Junior Collage Road Sullia,',
      'Dakshina Kannada,',
      'Karnataka, India',
    ],
    phoneNumber: '8951889737',
  },
  {
    id: 3,
    city: 'Branch 3',
    name: 'Gaana-Nritya Academy',
    address: [
      'Carnatic Vocal Only',
      'Srikrishna Jnanodaya Bhajana Mandira,',
      'Kottara Chowki,',
      'Mangalore – 575006,',
      'Karnataka, India',
    ],
    phoneNumber: '9449244843',
  },
  {
    id: 4,
    city: 'Branch 4',
    name: 'Gaana-Nritya Academy',
    address: [
      'Sri Narayana Guru Mandira,',
      'Marry Hill,',
      'Mangalore – 575006,',
      'Karnataka, India',
    ],
    phoneNumber: '9844481158 (Whatsapp Only), 9449244843',
  },
  {
    id: 5,
    city: 'Branch 5',
    name: 'Gaana-Nritya Academy',
    address: [
      'Sri Nandaneshwara Temple,',
      'Panamboor,',
      'Mangalore – 575006,',
      'Karnataka, India',
    ],
    phoneNumber: '9591773721',
  },
  {
    id: 6,
    city: 'Branch 6',
    name: 'Gaana-Nritya Academy',
    address: [
      'Devanga Bhavana,',
      'Ashok Nagar, Urva Store,',
      'Mangalore – 575006,',
      'Karnataka, India',
    ],
    phoneNumber: '9591773721',
  },
];

const associatedSchools = [
  {
    id: 1,
    city: 'Karkala',
    name: 'Sangeetaranga',
    address: [
      'Yajna,',
      'Rotory Club,',
      'Bhuvanendra Collage Road,',
      'Karkala,',
      'Karnataka, India',
    ],
    phoneNumber: '9591773721',
  },
  {
    id: 2,
    city: 'Bangalore',
    name: 'Gaana-Nritya Academy',
    address: [
      '99/1, Ground Floor,',
      'RS complex, opp. To BET School,',
      'Hesargatta Main road,',
      'Chikka Banaavaraa,',
      'Bangalore – 590090,',
      'Karnataka, India',
    ],
    phoneNumber: '7760034551',
  },
  {
    id: 3,
    city: 'Surat Sub Branch',
    name: 'Yagna School Of Dance',
    address: [
      'Akshata Nishanth,',
      'Sangitaranga Dance and Music school,',
      '193A Sai rachana Row House,',
      'Near Palgam circle, Adajan,',
      'Surat',
      'Gujarat, India',
    ],
    phoneNumber: '9099084814',
  },
];

const Classes = () => {
  useScrollToHash();

  return (
    <div className="relative flex h-auto w-full flex-col items-center justify-center">
      <div className="max-h-44 w-full md:max-h-[400px] 2xl:max-h-[500px]">
        <video
          src="https://res.cloudinary.com/dunzdojjw/video/upload/v1748811331/classes-video_xlubot.mp4"
          className="aspect-video w-full object-cover md:-mt-28"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </div>
      <div className="mb-10 flex w-full flex-col bg-white px-4 pt-10 md:mb-20 md:px-20">
        <div>
          <h1 className="text-xl font-semibold sm:text-3xl md:text-[32px]">
            Classes That Move with Grace & Melody
          </h1>
          <p className="mt-2 text-base font-medium sm:text-lg md:text-xl 2xl:text-2xl">
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
        <div className="mt-10 md:my-5 md:mt-0">
          <div
            className="my-6 grid grid-cols-1 gap-6 rounded-2xl md:grid-cols-2 md:gap-10 md:p-0 md:py-14 lg:gap-20"
            id="bharathanatyam"
          >
            <div className="order-1 mx-auto w-full">
              <img
                src={bharathanatyam}
                alt="Bharatanatyam"
                className="h-auto w-full rounded-lg"
              />
            </div>
            <div className="order-2 content-center py-2 md:py-4">
              <h1 className="text-2xl font-semibold leading-[130%] tracking-[-0.48px] md:text-[32px]">
                Bharatanatyam
              </h1>
              <p className="my-2 text-lg font-medium sm:text-xl">
                Grace in every step. Stories in every move.
              </p>
              <p className="mt-4 text-balance text-base leading-[170%] tracking-[-0.18px] sm:text-lg">
                Discover the soul of South Indian classical dance with our
                Bharatanatyam classes designed for all age groups. From basic
                adavus to intricate abhinaya and stage performances, students
                learn discipline, expression, and tradition in every session.
                Guided by experienced gurus, our curriculum nurtures both
                beginners and advanced learners into confident performers.
              </p>
              <Button
                variant={'secondary'}
                className="mt-6 text-primary md:mt-9"
              >
                <Link to="/contact">Join Now</Link>
              </Button>
            </div>
          </div>

          <div className="my-20" id="carnatic">
            <div className="my-6 grid grid-cols-1 gap-6 rounded-2xl bg-[#EEFAFF] p-4 sm:my-[100px] sm:p-8 md:grid-cols-2 md:gap-10 md:p-12 lg:gap-20">
              <div className="order-2 content-center py-2 md:order-1 md:py-4">
                <h1 className="text-2xl font-semibold leading-[130%] tracking-[-0.48px] md:text-[32px]">
                  Carnatic Music
                </h1>
                <p className="my-2 text-lg font-medium sm:text-xl">
                  Tune into the rhythm of tradition.
                </p>
                <p className="mt-4 text-balance text-base leading-[170%] tracking-[-0.18px] sm:text-lg">
                  Our Carnatic music classes offer a soulful journey into South
                  Indian classical vocals. With a strong focus on sruti, laya,
                  and raga development, students are trained to understand and
                  appreciate the depth of classical compositions. From basic
                  swaras to varnams and krithis, each learner gets personalized
                  attention and structured growth.
                </p>
                <Button
                  variant={'secondary'}
                  className="mt-6 text-primary md:mt-9"
                >
                  <Link to="/contact">Join Now</Link>
                </Button>
              </div>
              <div className="order-1 mx-auto w-full md:order-2">
                <img
                  src={carnatic}
                  alt="Carnatic Music"
                  className="h-auto w-full rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="my-20" id="kathak">
            <div className="my-6 grid grid-cols-1 gap-6 rounded-2xl sm:my-[100px] sm:p-8 md:grid-cols-2 md:gap-10 md:p-0 md:py-14 lg:gap-20">
              <div className="order-1 mx-auto w-full">
                <img
                  src={kathak}
                  alt="Kathak"
                  className="h-auto w-full rounded-lg"
                />
              </div>
              <div className="order-2 content-center py-2 md:py-4">
                <h1 className="text-2xl font-semibold leading-[130%] tracking-[-0.48px] md:text-[32px]">
                  Kathak
                </h1>
                <p className="my-2 text-lg font-medium sm:text-xl">
                  Where rhythm meets expression.
                </p>
                <p className="mt-4 text-balance text-base leading-[170%] tracking-[-0.18px] sm:text-lg">
                  Step into the world of Kathak dance and experience the
                  elegance of North Indian storytelling through footwork, spins,
                  and gestures. Our Kathak classes blend tradition and
                  creativity, helping students master both technical precision
                  and emotive performance. Open to all levels, the program
                  builds a strong foundation rooted in classical knowledge and
                  performance artistry.
                </p>
                <Button
                  variant={'secondary'}
                  className="mt-6 text-primary md:mt-9"
                >
                  <Link to="/contact">Join Now</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="my-20" id="workshops">
            <div className="my-6 grid grid-cols-1 gap-6 rounded-2xl bg-[#EEFAFF] p-4 sm:my-[100px] sm:p-8 md:grid-cols-2 md:gap-10 md:p-12 lg:gap-20">
              <div className="order-2 content-center py-2 md:order-1 md:py-4">
                <h1 className="text-2xl font-semibold leading-[130%] tracking-[-0.48px] md:text-[32px]">
                  Workshops
                </h1>
                <p className="my-2 text-lg font-medium sm:text-xl">
                  Tune into the rhythm of tradition.
                </p>
                <p className="mt-4 text-balance text-base leading-[170%] tracking-[-0.18px] sm:text-lg">
                  Our Carnatic music classes offer a soulful journey into South
                  Indian classical vocals. With a strong focus on sruti, laya,
                  and raga development, students are trained to understand and
                  appreciate the depth of classical compositions. From basic
                  swaras to varnams and krithis, each learner gets personalized
                  attention and structured growth.
                </p>
                <Button
                  variant={'secondary'}
                  className="mt-6 text-primary md:mt-9"
                >
                  <Link to="/contact">Join Now</Link>
                </Button>
              </div>
              <div className="order-1 mx-auto w-full md:order-2">
                <img
                  src={workshop}
                  alt="Carnatic Music"
                  className="h-auto w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <h1 className="text-2xl font-semibold leading-[130%] tracking-[-0.48px] md:text-[32px]">
            Branches: Our Reach Across Karnataka
          </h1>
          <p className="mt-2 text-lg leading-[170%] tracking-[-1%] sm:text-xl md:text-2xl lg:font-normal 2xl:font-medium">
            Gaana Nritya Academy brings Indian classical music and dance to
            communities statewide, nurturing talent in every corner
          </p>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-x-20 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
            {addressList.map((address, index) => (
              <div key={address.id} className="flex flex-col">
                <div className="relative flex justify-center">
                  <AddressCard address={address} />

                  {index % 2 !== 1 && index !== addressList.length - 1 && (
                    <div className="absolute -right-10 top-0 hidden h-full sm:block md:hidden">
                      <Separator
                        className="h-[80%] translate-y-[12%] bg-secondary"
                        orientation="vertical"
                      />
                    </div>
                  )}

                  {index % 3 !== 2 && index !== addressList.length - 1 && (
                    <div className="absolute -right-10 top-0 hidden h-full md:block">
                      <Separator
                        className="h-[80%] translate-y-[12%] bg-secondary"
                        orientation="vertical"
                      />
                    </div>
                  )}
                </div>

                {index !== addressList.length - 1 && (
                  <div className="mt-6 block sm:hidden">
                    <Separator className="h-[2px] w-full bg-secondary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <h1 className="pl-2 text-2xl font-semibold leading-[130%] tracking-[-0.48px] md:text-[28px]">
            Associated Schools
          </h1>
          <div className="mt-2 grid grid-cols-1 gap-x-20 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
            {associatedSchools.map((address, index) => (
              <div key={address.id} className="flex flex-col">
                <div className="relative flex justify-center">
                  <AddressCard address={address} />

                  {index % 2 !== 1 && index !== addressList.length - 1 && (
                    <div className="absolute -right-10 top-0 hidden h-full sm:block md:hidden">
                      <Separator
                        className="h-[80%] translate-y-[12%] bg-secondary"
                        orientation="vertical"
                      />
                    </div>
                  )}

                  {index % 3 !== 2 && index !== addressList.length - 1 && (
                    <div className="absolute -right-10 top-0 hidden h-full md:block">
                      <Separator
                        className="h-[80%] translate-y-[12%] bg-secondary"
                        orientation="vertical"
                      />
                    </div>
                  )}
                </div>

                {index !== addressList.length - 1 && (
                  <div className="mt-6 block sm:hidden">
                    <Separator className="h-[2px] w-full bg-secondary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
