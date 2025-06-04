import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from '@/components/Layout/Layout';

// Lazy load components for better performance
const Home = lazy(() => import('@/pages/Home'));
const PageNotFound = lazy(() => import('@/pages/PageNotFound'));
const SigninPage = lazy(() => import('@/pages/SigninPage'));
const Classes = lazy(() => import('@/pages/Classes'));
const Events = lazy(() => import('@/pages/Events'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Blogs = lazy(() => import('@/pages/Blogs'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const Contact = lazy(() => import('./pages/Contact'));

// Loading component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}

export default App;
