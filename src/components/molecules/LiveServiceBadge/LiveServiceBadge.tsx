'use client';

import React, { useState, useEffect } from 'react';
import styles from './LiveServiceBadge.module.scss';
import { isRestaurantOpen } from '@/utils/restaurantStatus';

interface LiveServiceBadgeProps {
  compact?: boolean;
}

export const LiveServiceBadge: React.FC<LiveServiceBadgeProps> = ({ compact = false }) => {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<{
    isOpen: boolean;
    text: string;
    isUrgent: boolean;
  }>({
    isOpen: false,
    text: "Horaires du Bistrot",
    isUrgent: false,
  });

  const evaluateStatus = () => {
    const now = new Date();
    const open = isRestaurantOpen(now);

    // Get time in Paris timezone
    let day = now.getDay();
    let hour = now.getHours();
    let minute = now.getMinutes();

    try {
      const parisStr = now.toLocaleString('en-US', { timeZone: 'Europe/Paris' });
      const parisDate = new Date(parisStr);
      day = parisDate.getDay();
      hour = parisDate.getHours();
      minute = parisDate.getMinutes();
    } catch {
      // Fallback to local time
    }

    const timeVal = hour + minute / 60;
    let badgeText = open ? 'Ouvert actuellement' : 'Fermé actuellement';
    let urgent = false;

    if (open) {
      if (day === 0) {
        // Dimanche (09h00 - 16h00)
        if (timeVal >= 9 && timeVal < 12) {
          badgeText = '☕ Bar ouvert • Déjeuner dès 12h';
        } else if (timeVal >= 12 && timeVal < 15) {
          badgeText = '☀️ Service midi en cours';
          urgent = true;
        } else {
          badgeText = 'Ouvert • Fermeture à 16h00';
        }
      } else {
        // Lundi - Samedi (Lundi-Jeudi jusqu'à 00h00, Vendredi-Samedi jusqu'à 01h00)
        const isLateNightWeekend = (day === 5 || day === 6 || day === 0) && (hour >= 23 || hour < 1);

        if (timeVal >= 8 && timeVal < 11.75) {
          badgeText = '☕ Bar ouvert • Déjeuner à 12h00';
        } else if (timeVal >= 11.75 && timeVal < 14.5) {
          badgeText = '☀️ Service du midi en cours';
          urgent = true;
        } else if (timeVal >= 14.5 && timeVal < 19) {
          badgeText = 'Terrasse & Bar ouverts • Dîner à 19h30';
        } else if (timeVal >= 19 && timeVal < 22.5) {
          badgeText = '🌙 Service du soir • Réservation conseillée';
          urgent = true;
        } else if (isLateNightWeekend) {
          badgeText = "🌙 Ouvert nocturne • Jusqu'à 01h00";
        } else {
          badgeText = "Bar ouvert • Jusqu'à minuit";
        }
      }
    } else {
      // Fermé
      if (day === 0 && timeVal >= 16) {
        badgeText = 'Fermé le dimanche soir • Ouvre lundi à 08h';
      } else if (day === 0 && timeVal < 9) {
        badgeText = 'Fermé actuellement • Ouvre à 09h00';
      } else if (timeVal < 8) {
        badgeText = 'Fermé actuellement • Ouvre à 08h00';
      } else {
        badgeText = 'Fermé actuellement • Ouvre à 08h00';
      }
    }

    setStatus({
      isOpen: open,
      text: badgeText,
      isUrgent: urgent,
    });
  };

  useEffect(() => {
    setMounted(true);
    evaluateStatus();
    const interval = setInterval(evaluateStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // SSR placeholder to prevent baking status into static build
  if (!mounted) {
    return (
      <span className={`${styles.badge} ${compact ? styles.compact : ''}`} suppressHydrationWarning>
        <span className={styles.loadingDot} />
        <span className={styles.badgeText}>Le Bistrot de l&apos;Église</span>
      </span>
    );
  }

  return (
    <span
      className={`${styles.badge} ${!status.isOpen ? styles.closed : ''} ${
        status.isUrgent ? styles.urgent : ''
      } ${compact ? styles.compact : ''}`}
      suppressHydrationWarning
    >
      <span
        className={
          status.isOpen
            ? status.isUrgent
              ? styles.urgentPulse
              : styles.pulseDot
            : styles.closedDot
        }
      />
      <span className={styles.badgeText}>{status.text}</span>
    </span>
  );
};
