import React, { Suspense, lazy } from 'react';

interface LazyComponentProps {
  factory: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

const LazyComponent: React.FC<LazyComponentProps> = ({ 
  factory, 
  fallback = <div className="flex items-center justify-center p-8">Loading...</div>,
  children 
}) => {
  const Component = lazy(factory);

  return (
    <Suspense fallback={fallback}>
      <Component>{children}</Component>
    </Suspense>
  );
};

export default LazyComponent;
