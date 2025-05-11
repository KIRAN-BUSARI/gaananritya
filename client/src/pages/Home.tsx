import Banner from '@/components/Banner';
import Hero from './Hero';
import FounderPage from './FounderPage';
import ImageBanner from '@/components/ImageBanner';
import banner from '@/assets/InvitationBanner.png';
import mobileBanner from '@/assets/mobileBanner.png';
import Achievements from './Achievements';
import Pillars from './Pillars';

export default function Home() {
  return (
    <>
      <Hero />
      <Banner />
      <FounderPage />
      <Achievements />
      <ImageBanner image={banner} mobileImage={mobileBanner} />
      <Pillars />
    </>
  );
}
