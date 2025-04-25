import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/Home';
import PageNotFound from '@/pages/PageNotFound';
import SigninPage from './pages/SigninPage';
import Gallery from './pages/Gallery';
import Classes from './pages/Classes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
