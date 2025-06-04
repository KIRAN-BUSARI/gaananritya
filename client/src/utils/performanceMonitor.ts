// Performance monitoring utilities for tracking web vitals and app performance

interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  loadTime?: number;
  memoryUsage?: number;
  connectionType?: string;
}

interface ImageLoadMetrics {
  url: string;
  loadTime: number;
  size?: number;
  format?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private imageMetrics: ImageLoadMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
    this.trackNavigationTiming();
    this.trackMemoryUsage();
    this.trackConnectionInfo();
  }

  private initializeObservers() {
    // Track LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.lcp = lastEntry.startTime;
          this.reportMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // Track FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.reportMetric('FID', this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Track CLS (Cumulative Layout Shift)
      try {
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
              this.metrics.cls = clsScore;
            }
          });
          this.reportMetric('CLS', clsScore);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }

      // Track resource loading
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
              this.trackImageLoad({
                url: entry.name,
                loadTime: entry.duration,
                size: (entry as any).transferSize,
              });
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('Resource observer not supported');
      }
    }
  }

  private trackNavigationTiming() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;

      // First Contentful Paint
      if ('getEntriesByType' in window.performance) {
        const paintEntries = window.performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(
          (entry) => entry.name === 'first-contentful-paint',
        );
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime;
          this.reportMetric('FCP', fcpEntry.startTime);
        }
      }

      // Time to First Byte
      this.metrics.ttfb = timing.responseStart - timing.requestStart;
      this.reportMetric('TTFB', this.metrics.ttfb);

      // Page Load Time
      window.addEventListener('load', () => {
        this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
        this.reportMetric('Load Time', this.metrics.loadTime);
      });
    }
  }

  private trackMemoryUsage() {
    if ('memory' in window.performance) {
      const memory = (window.performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1048576; // Convert to MB

      // Track memory usage periodically
      setInterval(() => {
        if ('memory' in window.performance) {
          const currentMemory = (window.performance as any).memory;
          this.metrics.memoryUsage = currentMemory.usedJSHeapSize / 1048576;
        }
      }, 5000);
    }
  }

  private trackConnectionInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.connectionType = connection.effectiveType;
    }
  }

  public trackImageLoad(metrics: ImageLoadMetrics) {
    this.imageMetrics.push(metrics);

    // Log slow image loads
    if (metrics.loadTime > 1000) {
      console.warn(
        `Slow image load detected: ${metrics.url} took ${metrics.loadTime}ms`,
      );
    }
  }

  public startMonitoring() {
    // Method to manually start monitoring if needed
    // All observers are already initialized in constructor
    console.log('Performance monitoring started');
  }

  public reportMetric(name: string, value: number) {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    }

    // Send to analytics service (implement based on your analytics provider)
    this.sendToAnalytics(name, value);
  }

  private sendToAnalytics(_name: string, _value: number) {
    // TODO: Implement analytics sending
    // Example: analytics.track(_name, { value: _value });
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getImageMetrics(): ImageLoadMetrics[] {
    return [...this.imageMetrics];
  }

  public getPerformanceScore(): number {
    let score = 100;

    // Deduct points based on Core Web Vitals
    if (this.metrics.lcp && this.metrics.lcp > 2500) score -= 20;
    if (this.metrics.fid && this.metrics.fid > 100) score -= 20;
    if (this.metrics.cls && this.metrics.cls > 0.1) score -= 20;
    if (this.metrics.fcp && this.metrics.fcp > 1800) score -= 15;
    if (this.metrics.ttfb && this.metrics.ttfb > 600) score -= 15;

    return Math.max(0, score);
  }

  public generateReport(): string {
    const score = this.getPerformanceScore();
    const slowImages = this.imageMetrics.filter((img) => img.loadTime > 1000);

    return `
Performance Report:
==================
Overall Score: ${score}/100

Core Web Vitals:
- LCP: ${this.metrics.lcp?.toFixed(2) || 'N/A'}ms (target: <2500ms)
- FID: ${this.metrics.fid?.toFixed(2) || 'N/A'}ms (target: <100ms)
- CLS: ${this.metrics.cls?.toFixed(3) || 'N/A'} (target: <0.1)

Other Metrics:
- FCP: ${this.metrics.fcp?.toFixed(2) || 'N/A'}ms (target: <1800ms)
- TTFB: ${this.metrics.ttfb?.toFixed(2) || 'N/A'}ms (target: <600ms)
- Load Time: ${this.metrics.loadTime?.toFixed(2) || 'N/A'}ms
- Memory Usage: ${this.metrics.memoryUsage?.toFixed(2) || 'N/A'}MB
- Connection: ${this.metrics.connectionType || 'N/A'}

Image Performance:
- Total Images Tracked: ${this.imageMetrics.length}
- Slow Loading Images (>1s): ${slowImages.length}
${slowImages.map((img) => `  - ${img.url}: ${img.loadTime.toFixed(2)}ms`).join('\n')}
    `.trim();
  }

  public destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
export { PerformanceMonitor };

// Export utilities for manual tracking
export const trackCustomMetric = (name: string, value: number) => {
  performanceMonitor.reportMetric(name, value);
};

export const markStart = (name: string) => {
  if (window.performance && window.performance.mark) {
    window.performance.mark(`${name}-start`);
  }
};

export const markEnd = (name: string) => {
  if (
    window.performance &&
    window.performance.mark &&
    window.performance.measure
  ) {
    window.performance.mark(`${name}-end`);
    try {
      window.performance.measure(name, `${name}-start`, `${name}-end`);
      const measures = window.performance.getEntriesByName(name, 'measure');
      if (measures.length > 0) {
        const duration = measures[measures.length - 1].duration;
        trackCustomMetric(name, duration);
      }
    } catch (e) {
      // Ignore measurement errors
    }
  }
};
