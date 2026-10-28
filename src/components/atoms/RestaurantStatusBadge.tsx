'use client';

import React, { useState, useEffect } from 'react';
import styles from './RestaurantStatusBadge.module.scss';
import { isRestaurantOpen, ScheduleItem } from '@/utils/restaurantStatus';

interface RestaurantStatusBadgeProps {
  schedule?: ScheduleItem[];
}

export const RestaurantStatusBadge: React.FC<RestaurantStatusBadgeProps> = ({ schedule }) => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOpen(isRestaurantOpen(new Date(), schedule));

    // Update status every 30 seconds
    const interval = setInterval(() => {
      setIsOpen(isRestaurantOpen(new Date(), schedule));
    }, 30000);

    return () => clearInterval(interval);
  }, [schedule]);

  if (!mounted) {
    return (
      <span className={styles.tagLoading} suppressHydrationWarning>
        Horaires du Bistrot
      </span>
    );
  }

  return (
    <span
      className={isOpen ? styles.tagOpen : styles.tagClosed}
      suppressHydrationWarning
    >
      {isOpen ? 'Ouvert actuellement' : 'Fermé actuellement'}
    </span>
  );
};
