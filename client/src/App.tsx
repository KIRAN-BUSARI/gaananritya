import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/Home';
import PageNotFound from '@/pages/PageNotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
