import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import PerformanceMonitor from '@/components/PerformanceMonitor';

// Lazy load components for better performance with preloading
const Home = lazy(() =>
  import('@/pages/Home').then((module) => {
    // Preload critical components that Home depends on
    import('@/components/OptimizedCarousel');
    import('@/components/ResponsiveImage');
    return module;
  }),
);

const PageNotFound = lazy(() => import('@/pages/PageNotFound'));
const SigninPage = lazy(() => import('@/pages/SigninPage'));
const Classes = lazy(() => import('@/pages/Classes'));
const Events = lazy(() => import('@/pages/Events'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Blogs = lazy(() => import('@/pages/Blogs'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const Contact = lazy(() => import('./pages/Contact'));

// Enhanced loading component with better UX
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary"></div>
        <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full border-4 border-secondary/10"></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Preparing your experience
        </p>
      </div>
    </div>
  </div>
);

function App() {
  const {
    preloadCriticalImages,
    preloadCriticalResources,
    getPerformanceReport,
  } = usePerformanceOptimization({
    enableWebVitals: true,
    enableMemoryMonitoring: true,
    enableImageOptimization: true,
  });

  useEffect(() => {
    // Preload critical images for hero section
    const criticalImages = [
      '/images/optimized/heroSection0/heroSection0-desktop.webp',
      '/images/optimized/heroSection1/heroSection1-desktop.webp',
      '/images/optimized/heroSection2/heroSection2-desktop.webp',
    ];

    preloadCriticalImages(criticalImages);

    // Preload critical CSS and fonts
    preloadCriticalResources([
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
      {
        href: '/fonts/playfair-display-var.woff2',
        as: 'font',
        type: 'font/woff2',
      },
    ]);

    // Performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const report = getPerformanceReport();
        console.log('Performance Report:', report);
      }, 5000);
    }
  }, [preloadCriticalImages, preloadCriticalResources, getPerformanceReport]);

  return (
    <>
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

      {/* Performance Monitor - only in development */}
      <PerformanceMonitor />
    </>
  );
}

export default App;
