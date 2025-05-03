import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/Home';
import PageNotFound from '@/pages/PageNotFound';
import SigninPage from '@/pages/SigninPage';
import Classes from '@/pages/Classes';
import Events from '@/pages/Events';
import Gallery from '@/pages/Gallery';
import Blogs from '@/pages/Blogs';
import BlogPage from '@/pages/BlogPage';
import Contact from './pages/Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/media" element={<Gallery />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
