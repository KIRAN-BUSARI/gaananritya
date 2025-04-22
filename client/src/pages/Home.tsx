import Banner from '@/components/Banner';
import Hero from './Hero';
import FounderPage from './FounderPage';
import ImageBanner from '@/components/ImageBanner';
// import Gallery from './Gallery';
import banner from '@/assets/InvitationBanner.png';
import Achievements from './Achievements';
export default function Home() {
  return (
    <>
      <Hero />
      <Banner />
      {/* <Gallery /> */}
      <FounderPage />
      <ImageBanner image={banner} />
      <Achievements />
    </>
  );
}
