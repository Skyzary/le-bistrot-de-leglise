'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './EventsSection.module.scss';
import { Calendar, Clock, Sparkles, ArrowRight, CalendarPlus } from 'lucide-react';
import { FaApple } from 'react-icons/fa6';
import { eventsData, BistrotEvent, themeData } from '@/config/data';
import { triggerHaptic } from '@/utils/haptics';
import { downloadIcsFile, getGoogleCalendarUrl, CalendarEvent } from '@/utils/calendar';
import { smoothScrollTo } from '@/components/atoms/SmoothScroll';

const BISTROT_LOCATION = "Le Bistrot de l'Église, 4 place du 11 novembre 1918, 34690 Fabrègues";

function buildCalendarEvent(event: BistrotEvent): CalendarEvent {
  return {
    title: `${event.title} — Le Bistrot de l'Église`,
    description: `${event.description}\n\nAdresse : ${BISTROT_LOCATION}\nTéléphone : 04 34 11 75 85`,
    location: BISTROT_LOCATION,
    date: event.date,
    time: event.time,
    durationHours: 2.5,
  };
}

export const EventsSection = () => {
  const [openCalendarIdx, setOpenCalendarIdx] = useState<number | null>(null);

  const handleReserveEvent = useCallback((event: BistrotEvent) => {
    triggerHaptic('medium');
    const eventText = `Réservation pour l'événement : ${event.title} (${event.date} - ${event.time})`;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('bistrot_reservation_requests', eventText);
        window.dispatchEvent(new CustomEvent('set-reservation-requests', { detail: eventText }));
      } catch {
        // storage fallback
      }

      smoothScrollTo('reservation');
    }
  }, []);

  const handleToggleCalendar = useCallback((idx: number) => {
    triggerHaptic('light');
    setOpenCalendarIdx((prev) => (prev === idx ? null : idx));
  }, []);

  const handleAppleCalendar = useCallback((event: BistrotEvent) => {
    triggerHaptic('success');
    downloadIcsFile(buildCalendarEvent(event));
    setOpenCalendarIdx(null);
  }, []);

  const handleGoogleCalendar = useCallback(() => {
    triggerHaptic('success');
    setOpenCalendarIdx(null);
  }, []);

  if (!eventsData || eventsData.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tag}>
            <Sparkles size={18} />
            <span>
              {themeData.mode === 'halloween'
                ? '🎃 Spécial Halloween & Agenda du Bistrot 🦇'
                : themeData.mode === 'noel'
                  ? '🎄 Agenda des Fêtes & Rendez-Vous du Bistrot ✨'
                  : 'Agenda du Bistrot'}
            </span>
          </div>
          <h2 className={styles.title}>
            {themeData.mode === 'halloween'
              ? 'Les Nuits & Rendez-Vous du Bistrot'
              : themeData.mode === 'noel'
                ? 'Nos Prochains Moments Festifs'
                : 'Nos Prochains Événements'}
          </h2>
          <p className={styles.description}>
            {themeData.mode === 'halloween'
              ? "Ce samedi soir, le Bistrot de l'Église se transforme pour Halloween : déguisements, bonbons 🍬 pour les petits et shooter du diablotin 😈 pour les grands !"
              : themeData.mode === 'noel'
                ? "Soirées conviviales, suggestions festives du Chef et moments chaleureux à partager au Bistrot de l'Église."
                : 'Soirées à thème, suggestions du jour et moments conviviaux à partager au cœur de Fabrègues.'}
          </p>
        </div>

        <div className={styles.grid} id="evenements">
          {eventsData.map((event, idx) => {
            const calEvent = buildCalendarEvent(event);
            const googleUrl = getGoogleCalendarUrl(calEvent);
            const isCalOpen = openCalendarIdx === idx;

            return (
              <article key={idx} className={styles.card}>
                {event.image && (
                  <div className={styles.posterWrapper}>
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      quality={75}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 520px"
                      className={styles.posterImage}
                    />
                    <div className={styles.posterOverlay} />
                    {event.tag && <span className={styles.eventBadge}>{event.tag}</span>}
                  </div>
                )}

                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span className={styles.metaItem}>
                      <Calendar size={14} className={styles.metaIcon} />
                      <span>{event.date}</span>
                    </span>
                    <span className={styles.metaDot} aria-hidden="true">•</span>
                    <span className={styles.metaItem}>
                      <Clock size={14} className={styles.metaIcon} />
                      <span>{event.time}</span>
                    </span>
                  </div>

                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDesc}>{event.description}</p>

                  <div className={styles.actionsRow}>
                    <button
                      type="button"
                      className={styles.reserveBtn}
                      onClick={() => handleReserveEvent(event)}
                    >
                      <span>Réserver</span>
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      className={`${styles.calendarToggleBtn} ${isCalOpen ? styles.calendarToggleActive : ''}`}
                      onClick={() => handleToggleCalendar(idx)}
                      aria-expanded={isCalOpen}
                      aria-label={`Ajouter ${event.title} au calendrier`}
                    >
                      <CalendarPlus size={16} />
                      <span>Ajouter à l&apos;agenda</span>
                    </button>
                  </div>

                  {isCalOpen && (
                    <div className={styles.calendarMenu}>
                      <button
                        type="button"
                        className={styles.calendarOption}
                        onClick={() => handleAppleCalendar(event)}
                      >
                        <FaApple size={15} />
                        <span>Apple / Outlook (.ics)</span>
                      </button>
                      <a
                        href={googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.calendarOption}
                        onClick={handleGoogleCalendar}
                      >
                        <Calendar size={15} />
                        <span>Google Agenda</span>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
