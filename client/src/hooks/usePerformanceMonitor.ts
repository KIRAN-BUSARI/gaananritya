import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  imageLoadTime: number;
  carouselRenderTime: number;
  memoryUsage?: number;
  fps?: number;
}

export const usePerformanceMonitor = (componentName: string = 'Component') => {
  const metricsRef = useRef<PerformanceMetrics>({
    imageLoadTime: 0,
    carouselRenderTime: 0,
  });

  const markStart = (label: string) => {
    if (performance && performance.mark) {
      performance.mark(`${componentName}-${label}-start`);
    }
  };

  const markEnd = (label: string) => {
    if (performance && performance.mark && performance.measure) {
      performance.mark(`${componentName}-${label}-end`);
      performance.measure(
        `${componentName}-${label}`,
        `${componentName}-${label}-start`,
        `${componentName}-${label}-end`,
      );
    }
  };

  const measureImageLoad = (imageSrc: string) => {
    return new Promise<number>((resolve) => {
      const startTime = performance.now();
      const img = new Image();

      img.onload = () => {
        const loadTime = performance.now() - startTime;
        metricsRef.current.imageLoadTime = loadTime;
        resolve(loadTime);
      };

      img.onerror = () => {
        resolve(-1); // Error indicator
      };

      img.src = imageSrc;
    });
  };

  const getMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  };

  const measureFPS = () => {
    let fps = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFrame = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime >= lastTime + 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        metricsRef.current.fps = fps;
      }

      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
    return fps;
  };

  const logMetrics = () => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚀 Performance Metrics - ${componentName}`);
      console.log(
        'Image Load Time:',
        `${metricsRef.current.imageLoadTime.toFixed(2)}ms`,
      );
      console.log(
        'Render Time:',
        `${metricsRef.current.carouselRenderTime.toFixed(2)}ms`,
      );

      const memory = getMemoryUsage();
      if (memory) {
        console.log(
          'Memory Usage:',
          `${(memory.used / 1024 / 1024).toFixed(2)}MB`,
        );
      }

      if (metricsRef.current.fps) {
        console.log('FPS:', metricsRef.current.fps);
      }

      console.groupEnd();
    }
  };

  useEffect(() => {
    // Log metrics on component unmount
    return () => {
      logMetrics();
    };
  }, []);

  return {
    markStart,
    markEnd,
    measureImageLoad,
    getMemoryUsage,
    measureFPS,
    logMetrics,
    metrics: metricsRef.current,
  };
};
