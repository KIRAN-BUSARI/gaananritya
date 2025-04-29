import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/Home';
import PageNotFound from '@/pages/PageNotFound';
import SigninPage from './pages/SigninPage';
import Classes from './pages/Classes';
import Events from './pages/Events';
import Gallery from './pages/Gallery';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/media" element={<Gallery />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/events" element={<Events />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
