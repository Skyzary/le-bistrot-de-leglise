'use client';

import React, { useState, useEffect } from 'react';
import styles from './RestaurantStatusBadge.module.scss';
import { isRestaurantOpen, ScheduleItem } from '@/utils/restaurantStatus';

interface RestaurantStatusBadgeProps {
  schedule?: ScheduleItem[];
}

export const RestaurantStatusBadge: React.FC<RestaurantStatusBadgeProps> = ({ schedule }) => {
  const [isOpen, setIsOpen] = useState<boolean>(() => isRestaurantOpen(new Date(), schedule));

  useEffect(() => {
    // Ensure accurate client-side evaluation immediately after mount
    setIsOpen(isRestaurantOpen(new Date(), schedule));

    // Update status every minute
    const interval = setInterval(() => {
      setIsOpen(isRestaurantOpen(new Date(), schedule));
    }, 60000);

    return () => clearInterval(interval);
  }, [schedule]);

  return (
    <span
      className={isOpen ? styles.tagOpen : styles.tagClosed}
      suppressHydrationWarning
    >
      {isOpen ? 'Ouvert actuellement' : 'Fermé actuellement'}
    </span>
  );
};
