import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import AudioPlayer from '@/components/MusicControl/AudioPlayer';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-100px)]">
        <Outlet />
      </main>
      <Footer />
      <AudioPlayer />
    </>
  );
};

export default Layout;
