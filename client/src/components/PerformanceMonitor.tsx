import React, { useState, useEffect } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showInProduction?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right',
  showInProduction = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<any>({});

  const { getPerformanceReport, webVitals, memoryInfo } =
    usePerformanceOptimization();

  useEffect(() => {
    if (
      !enabled ||
      (process.env.NODE_ENV === 'production' && !showInProduction)
    ) {
      return;
    }

    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      const report = getPerformanceReport();
      setMetrics({
        ...report,
        webVitals,
        memoryInfo,
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [enabled, showInProduction, getPerformanceReport, webVitals, memoryInfo]);

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (
    !enabled ||
    (process.env.NODE_ENV === 'production' && !showInProduction)
  ) {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatMs = (ms: number) => {
    if (!ms) return '0ms';
    return Math.round(ms) + 'ms';
  };

  const getScoreColor = (
    value: number,
    thresholds: { good: number; fair: number },
  ) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.fair) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed z-50 rounded-full bg-black/80 p-2 text-white shadow-lg transition-opacity hover:bg-black/90 ${
          positionClasses[position]
        } ${isVisible ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
        title="Performance Monitor (Ctrl+Shift+P)"
      >
        📊
      </button>

      {/* Performance panel */}
      {isVisible && (
        <div
          className={`fixed z-40 max-h-96 w-80 overflow-y-auto rounded-lg bg-black/90 p-4 text-white shadow-lg backdrop-blur-sm ${
            position.includes('right') ? 'right-4' : 'left-4'
          } ${position.includes('top') ? 'top-16' : 'bottom-16'}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Web Vitals */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-gray-300">
              Web Vitals
            </h4>
            <div className="space-y-1 text-xs">
              {metrics.webVitals?.FCP && (
                <div className="flex justify-between">
                  <span>First Contentful Paint:</span>
                  <span
                    className={getScoreColor(metrics.webVitals.FCP, {
                      good: 1800,
                      fair: 3000,
                    })}
                  >
                    {formatMs(metrics.webVitals.FCP)}
                  </span>
                </div>
              )}
              {metrics.webVitals?.LCP && (
                <div className="flex justify-between">
                  <span>Largest Contentful Paint:</span>
                  <span
                    className={getScoreColor(metrics.webVitals.LCP, {
                      good: 2500,
                      fair: 4000,
                    })}
                  >
                    {formatMs(metrics.webVitals.LCP)}
                  </span>
                </div>
              )}
              {metrics.webVitals?.CLS !== undefined && (
                <div className="flex justify-between">
                  <span>Cumulative Layout Shift:</span>
                  <span
                    className={getScoreColor(metrics.webVitals.CLS, {
                      good: 0.1,
                      fair: 0.25,
                    })}
                  >
                    {metrics.webVitals.CLS.toFixed(3)}
                  </span>
                </div>
              )}
              {metrics.webVitals?.TTFB && (
                <div className="flex justify-between">
                  <span>Time to First Byte:</span>
                  <span
                    className={getScoreColor(metrics.webVitals.TTFB, {
                      good: 800,
                      fair: 1800,
                    })}
                  >
                    {formatMs(metrics.webVitals.TTFB)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Memory Usage */}
          {metrics.memoryInfo && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-gray-300">
                Memory Usage
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Used JS Heap:</span>
                  <span>{formatBytes(metrics.memoryInfo.usedJSHeapSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total JS Heap:</span>
                  <span>{formatBytes(metrics.memoryInfo.totalJSHeapSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>JS Heap Limit:</span>
                  <span>{formatBytes(metrics.memoryInfo.jsHeapSizeLimit)}</span>
                </div>
                <div className="mt-1 h-2 rounded bg-gray-700">
                  <div
                    className="h-full rounded bg-blue-500"
                    style={{
                      width: `${(metrics.memoryInfo.usedJSHeapSize / metrics.memoryInfo.jsHeapSizeLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {metrics.recommendations && metrics.recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-gray-300">
                Recommendations
              </h4>
              <div className="space-y-1 text-xs">
                {metrics.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="text-yellow-400">
                    • {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Network */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-gray-300">Network</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Connection:</span>
                <span>
                  {(navigator as any).connection?.effectiveType || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Online:</span>
                <span
                  className={
                    navigator.onLine ? 'text-green-500' : 'text-red-500'
                  }
                >
                  {navigator.onLine ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Last updated: {metrics.timestamp}
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceMonitor;
