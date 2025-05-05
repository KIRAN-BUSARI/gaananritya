import img1 from '@/assets/pillars/faculty1.png';
import img2 from '@/assets/pillars/faculty2.png';
import img3 from '@/assets/pillars/faculty3.png';
import img5 from '@/assets/pillars/faculty5.png';
import img6 from '@/assets/pillars/faculty6.png';
import img7 from '@/assets/pillars/faculty7.png';
import img8 from '@/assets/pillars/faculty8.png';

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
      "A dedicated cultural enthusiast and passionate arts administrator, Radhakrishna Bhat has been an integral part of Gaana Nritya Academy's growth journey. With over a decade of experience in organizational management, he ensures the smooth execution of events, performances, and academic coordination. His commitment to promoting Indian classical arts, especially in rural and underrepresented communities, reflects in every initiative led by the academy. Known for his discipline and warmth, he bridges the gap between tradition and innovation in his role as Secretary.",
  },
  {
    image: img2,
    name: 'Vidushi Bindiya Prathik',
    designation: 'Faculty - Bharathantyam',
    description:
      'A seasoned Carnatic vocalist and composer, Shri Krishnacharya began his musical journey under his father Ramacharya and later trained with maestros like B. Somasunder Rao and Kanchana Subbaratnam. He holds a Vidwat qualification and has performed widely, including on Mangalore AIR. As the lead vocalist for over 25 Bharatanatyam troupes, he has also composed music for several dance productions. In 2003, he founded Keertana Sangeet Shale in Bantwal, where he and his wife now mentor 250+ students both offline and online.',
  },
  {
    image: img3,
    name: 'Vidwan Krishnacharya Bantwal',
    designation: 'Faculty - Carnatic Music',
    description:
      'A seasoned Carnatic vocalist and composer, Shri Krishnacharya began his musical journey under his father Ramacharya and later trained with maestros like B. Somasunder Rao and Kanchana Subbaratnam. He holds a Vidwat qualification and has performed widely, including on Mangalore AIR. As the lead vocalist for over 25 Bharatanatyam troupes, he has also composed music for several dance productions. In 2003, he founded Keertana Sangeet Shale in Bantwal, where he and his wife now mentor 250+ students both offline and online.',
  },
  {
    image: img5,
    name: 'Vidushi Ankitha Rai Pranam',
    designation: 'Faculty - Carnatic Music',
    description:
      ' A senior disciple of Guru Vidyashree Radhakrishna, Ankitha has been learning Bharatanatyam for over 21 years. She completed her Vidwat with First Class and presented her Rangapravesha in 2017. A B-Grade Doordarshan artist, she has performed at major festivals like Naadanirajanam (Tirupati), Natyanjali (Nagapattinam), Hampi Utsav, and ABSS International Fest (Sri Lanka). She also represented India at the Sarang Festival in South Korea under ICCR. Currently, she serves as a faculty member at Gaana Nritya Academy, managing its Urwastore and Panamboor branches. She also runs Yagna – School of Dance in Karkala, under the guidance of her Guru.',
  },
  {
    image: img6,
    name: 'Vidushi Rajatha Krishacharya',
    designation: 'Faculty - Carnatic Music',
    description:
      'A seasoned Carnatic vocalist and composer, Shri Krishnacharya began his musical journey under his father Ramacharya and later trained with maestros like B. Somasunder Rao and Kanchana Subbaratnam. He holds a Vidwat qualification and has performed widely, including on Mangalore AIR. As the lead vocalist for over 25 Bharatanatyam troupes, he has also composed music for several dance productions. In 2003, he founded Keertana Sangeet Shale in Bantwal, where he and his wife now mentor 250+ students both offline and online.',
  },
  {
    image: img7,
    name: 'Vidushi Manjushree Raghav',
    designation: 'Faculty - Carnatic Music',
    description:
      'Manjushree Raghav, a Mangalore-born Bharatanatyam dancer with a Vidwat certification, has trained for over 20 years under Guru Vidushi Vidyashree Radhakrishna. With 12+ years of teaching experience, including three years at Alapana Arts in Singapore, she is also trained in Kathak and Odissi. A winner of the international Bharatanatyam competition by ABSS Pune (2015–16), she has performed at prestigious platforms like Alva’s Nudisiri and Dharmasthala Lakshadeepotsava. Her choreographic work *Pajje Gejje*, blending Kannada and Tulu folk with Bharatanatyam, was highly acclaimed during Gandhi Jayanti celebrations at SKICC, Srinagar. Currently, she teaches at Gaana Nritya Academy in Sullia and Mangalore and conducts online classes for students worldwide.',
  },
  {
    image: img8,
    name: 'Vidushi Teena Chethan Poombady',
    designation: 'Faculty - Carnatic Music',
    description:
      'Teena Chethan Poombady, a Mysore-born Bharatanatyam dancer with over 15 years of experience, holds a “Vidwath” in dance and has trained under renowned gurus including Vid. Smt. Vidyashree Radhakrishna. Though academically an M.Sc. in Biotechnology, her passion for classical arts remains unwavering. She is a Doordarshan-graded artist and founder of Gaana Nritya Academy branches in Chikkabhanavara and Abbigere, where she trains over 100 students. Teena has received advanced training from eminent dancers like Dr. Padma Subramaniam and Guru Rama Vaidyanathan, and her students have earned accolades in the government’s “Pratibha Karanji” competitions. Her annual “Aarohana” program nurtures and showcases emerging dance talent.',
  },
];

const Pillars = () => {
  return (
    <div className="mx-auto flex flex-col px-4 py-12 sm:px-6 md:px-10 lg:px-20 lg:py-20">
      <div className="mx-auto w-full text-center sm:text-left">
        <h1 className="text-2xl font-semibold leading-[130%] tracking-[-1.5%] sm:text-3xl lg:text-[32px]">
          Pillars & Strength of Gaana Nritya Academy
        </h1>
        <p className="mt-3 max-w-4xl text-sm font-medium leading-[170%] tracking-[-1%] sm:text-base md:mt-4 md:text-lg">
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
