/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Suspense } from 'react';
import OverlayLoader from '../OverlayLoader';

interface LazyTabProps {
  id?: string;
  label?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  tabId?: string;
}

const LazyTab: React.FC<LazyTabProps> = ({
  id,
  label,
  tabId,
  children,
  fallback,
}) => {
  return (
    <Suspense fallback={fallback || <OverlayLoader open />}>
      {children}
    </Suspense>
  );
};

export default LazyTab;
