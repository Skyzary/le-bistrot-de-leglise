'use client';

import React, { useState, useEffect } from 'react';
import styles from './LiveServiceBadge.module.scss';
import { Sparkles, Clock, Flame } from 'lucide-react';

export const LiveServiceBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !now) {
    // Initial server fallback
    return (
      <span className={styles.badge} suppressHydrationWarning>
        <span className={styles.pulseDot} />
        Ouvert aujourd&apos;hui
      </span>
    );
  }

  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeVal = hour + minute / 60;

  let badgeText = "Ouvert aujourd'hui";
  let isUrgent = false;

  if (day === 0) {
    if (timeVal >= 9 && timeVal < 12) {
      badgeText = 'Café & Matin • Déjeuner dès 12h';
    } else if (timeVal >= 12 && timeVal < 15.5) {
      badgeText = '☀️ Service midi en cours';
      isUrgent = true;
    } else {
      badgeText = 'Fermé le dimanche soir';
    }
  } else {
    if (timeVal >= 8 && timeVal < 11.75) {
      badgeText = '☕ Bar ouvert • Déjeuner à 12h00';
    } else if (timeVal >= 11.75 && timeVal < 14.5) {
      badgeText = '☀️ Service du midi • Tables limitées';
      isUrgent = true;
    } else if (timeVal >= 14.5 && timeVal < 19) {
      badgeText = 'Terrasse ouverte • Dîner dès 19h30';
    } else if (timeVal >= 19 && timeVal < 22.5) {
      badgeText = '🌙 Service du soir • Réservation conseillée';
      isUrgent = true;
    } else {
      badgeText = 'Bar ouvert • Réservations pour demain';
    }
  }

  return (
    <span className={`${styles.badge} ${isUrgent ? styles.urgent : ''} ${compact ? styles.compact : ''}`}>
      <span className={`${styles.pulseDot} ${isUrgent ? styles.urgentPulse : ''}`} />
      <span className={styles.badgeText}>{badgeText}</span>
    </span>
  );
};

