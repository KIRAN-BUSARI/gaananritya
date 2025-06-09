import { useEffect, useCallback, useRef } from 'react';

interface PerformanceConfig {
  enableWebVitals?: boolean;
  enableMemoryMonitoring?: boolean;
  enableImageOptimization?: boolean;
  enableBundleAnalysis?: boolean;
}

interface WebVitals {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

export const usePerformanceOptimization = (config: PerformanceConfig = {}) => {
  const {
    enableWebVitals = true,
    enableMemoryMonitoring = true,
    enableImageOptimization = true,
    enableBundleAnalysis = false,
  } = config;

  const vitalsRef = useRef<WebVitals>({});
  const memoryRef = useRef<any>(null);

  // Web Vitals monitoring
  const measureWebVitals = useCallback(() => {
    if (!enableWebVitals || typeof window === 'undefined') return;

    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            vitalsRef.current.FCP = entry.startTime;
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitalsRef.current.LCP = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        vitalsRef.current.CLS = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Time to First Byte
    if (performance.timing) {
      vitalsRef.current.TTFB =
        performance.timing.responseStart - performance.timing.navigationStart;
    }
  }, [enableWebVitals]);

  // Memory monitoring
  const monitorMemory = useCallback(() => {
    if (!enableMemoryMonitoring || typeof window === 'undefined') return;

    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        memoryRef.current = {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        };
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [enableMemoryMonitoring]);

  // Image preloading optimization
  const preloadCriticalImages = useCallback(
    async (imageUrls: string[]) => {
      if (!enableImageOptimization) return;

      const preloadPromises = imageUrls.slice(0, 3).map((url) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to preload ${url}`));
          img.src = url;

          // Set high priority for critical images
          if ('fetchPriority' in img) {
            (img as any).fetchPriority = 'high';
          }
        });
      });

      try {
        await Promise.allSettled(preloadPromises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    },
    [enableImageOptimization],
  );

  // Resource prefetching
  const prefetchResources = useCallback(
    (resources: Array<{ href: string; as: string; type?: string }>) => {
      resources.forEach(({ href, as, type }) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        link.as = as;
        if (type) link.type = type;
        document.head.appendChild(link);
      });
    },
    [],
  );

  // Critical resource preloading
  const preloadCriticalResources = useCallback(
    (resources: Array<{ href: string; as: string; type?: string }>) => {
      resources.forEach(({ href, as, type }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (type) link.type = type;
        document.head.appendChild(link);
      });
    },
    [],
  );

  // Optimize third-party scripts
  const loadThirdPartyScript = useCallback(
    (src: string, async = true, defer = true) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = async;
        script.defer = defer;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    },
    [],
  );

  // Bundle analysis (development only)
  const analyzeBundleSize = useCallback(() => {
    if (!enableBundleAnalysis || process.env.NODE_ENV !== 'development') return;

    // This would typically integrate with webpack-bundle-analyzer or similar
    console.log('Bundle analysis would run here in development mode');
  }, [enableBundleAnalysis]);

  // Cleanup and performance recommendations
  const getPerformanceReport = useCallback(() => {
    const report = {
      webVitals: vitalsRef.current,
      memory: memoryRef.current,
      recommendations: [] as string[],
    };

    // Generate recommendations based on metrics
    if (vitalsRef.current.LCP && vitalsRef.current.LCP > 2500) {
      report.recommendations.push(
        'Consider optimizing Largest Contentful Paint (LCP) - target < 2.5s',
      );
    }

    if (vitalsRef.current.FCP && vitalsRef.current.FCP > 1800) {
      report.recommendations.push(
        'Consider optimizing First Contentful Paint (FCP) - target < 1.8s',
      );
    }

    if (vitalsRef.current.CLS && vitalsRef.current.CLS > 0.1) {
      report.recommendations.push(
        'Consider reducing Cumulative Layout Shift (CLS) - target < 0.1',
      );
    }

    if (
      memoryRef.current &&
      memoryRef.current.usedJSHeapSize > 50 * 1024 * 1024
    ) {
      report.recommendations.push(
        'Consider optimizing JavaScript memory usage - current usage > 50MB',
      );
    }

    return report;
  }, []);

  useEffect(() => {
    measureWebVitals();
    const cleanupMemory = monitorMemory();
    analyzeBundleSize();

    return () => {
      cleanupMemory?.();
    };
  }, [measureWebVitals, monitorMemory, analyzeBundleSize]);

  return {
    preloadCriticalImages,
    prefetchResources,
    preloadCriticalResources,
    loadThirdPartyScript,
    getPerformanceReport,
    webVitals: vitalsRef.current,
    memoryInfo: memoryRef.current,
  };
};
