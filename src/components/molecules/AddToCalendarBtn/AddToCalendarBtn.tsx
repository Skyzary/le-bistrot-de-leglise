'use client';

import React from 'react';
import styles from './AddToCalendarBtn.module.scss';
import { Calendar, CalendarPlus } from 'lucide-react';
import { downloadIcsFile, getGoogleCalendarUrl, CalendarEvent } from '@/utils/calendar';
import { triggerHaptic } from '@/utils/haptics';

interface AddToCalendarBtnProps {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  name?: string;
  location?: 'inside' | 'terrace' | string;
}

export const AddToCalendarBtn: React.FC<AddToCalendarBtnProps> = ({
  date,
  time,
  guests,
  name,
  location,
}) => {
  const locLabel = location === 'terrace' ? 'en terrasse ombragée' : 'en salle';

  const eventData: CalendarEvent = {
    title: `Table au Bistrot de l'Église (${guests} pers.)`,
    description: `Réservation confirmée${name ? ` au nom de ${name}` : ''} pour ${guests} personne${
      guests > 1 ? 's' : ''
    } (${locLabel}).\n\nAdresse : 4 place du 11 novembre 1918, 34690 Fabrègues\nTéléphone : 04 34 11 75 85\nItinéraire : https://maps.apple.com/?q=Le+Bistrot+de+l%27%C3%89glise+Fabr%C3%A8gues`,
    location: "Le Bistrot de l'Église, 4 place du 11 novembre 1918, 34690 Fabrègues",
    date,
    time,
    durationHours: 2,
  };

  const handleAppleClick = () => {
    triggerHaptic('success');
    downloadIcsFile(eventData);
  };

  const handleGoogleClick = () => {
    triggerHaptic('success');
  };

  const googleUrl = getGoogleCalendarUrl(eventData);

  return (
    <div className={styles.container}>
      <span className={styles.label}>
        <CalendarPlus size={14} /> Ajouter à votre calendrier
      </span>
      <div className={styles.buttonRow}>
        <button
          type="button"
          onClick={handleAppleClick}
          className={`${styles.calendarBtn} ${styles.appleBtn}`}
          aria-label="Ajouter à Apple Calendrier"
        >
          <span className={styles.appleIcon}></span>
          <span>Apple Calendrier</span>
        </button>

        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleGoogleClick}
          className={`${styles.calendarBtn} ${styles.googleBtn}`}
          aria-label="Ajouter à Google Agenda"
        >
          <Calendar size={15} />
          <span>Google Agenda</span>
        </a>
      </div>
    </div>
  );
};

