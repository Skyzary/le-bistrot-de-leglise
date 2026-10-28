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

const AppleIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor" aria-hidden="true">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.85-11.71-14.43-5.77-9.33-10.42-20.2-13.93-32.61-3.52-12.41-5.28-24.08-5.28-35.01 0-14.16 3.66-26.06 10.99-35.7 7.33-9.64 16.5-14.54 27.52-14.72 5.09 0 10.61 1.34 16.57 4.02 5.96 2.68 9.94 4.08 11.95 4.19 1.79 0 5.86-1.42 12.21-4.26 6.35-2.84 11.83-4.14 16.44-3.89 12.75.64 22.86 5.56 30.34 14.77-11.09 6.72-16.52 16.03-16.3 27.93.22 9.5 3.97 17.44 11.24 23.82 7.27 6.38 15.93 10.05 25.98 11.01-2.18 6.64-4.88 13.25-8.12 19.83zM119.22 31.84c0-7.72 2.76-14.99 8.28-21.82 5.52-6.83 12.35-10.98 20.49-12.45.22 1.09.33 2.18.33 3.27 0 7.61-2.82 14.88-8.47 21.81-5.65 6.93-12.51 11.05-20.57 12.36-.06-1.09-.06-2.09-.07-3.17z" />
  </svg>
);

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
          <span className={styles.appleIcon}>
            <AppleIcon size={15} />
          </span>
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

