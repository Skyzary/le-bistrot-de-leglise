'use client';

import React from 'react';
import { themeData } from '@/config/data';
import { HalloweenDecorations } from './HalloweenDecorations';
import { NoelDecorations } from './NoelDecorations';

export const SeasonalDecorations: React.FC = () => {
  if (themeData.mode === 'halloween') {
    return <HalloweenDecorations />;
  }
  if (themeData.mode === 'noel') {
    return <NoelDecorations />;
  }
  return null;
};

