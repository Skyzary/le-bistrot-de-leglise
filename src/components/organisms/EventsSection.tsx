'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import styles from './EventsSection.module.scss';
import { Calendar, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { eventsData, BistrotEvent } from '@/config/data';
import { triggerHaptic } from '@/utils/haptics';

export const EventsSection = () => {
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

      const el = document.getElementById('reservation');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  if (!eventsData || eventsData.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} id="evenements">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tag}>
            <Sparkles size={18} />
            <span>Agenda du Bistrot</span>
          </div>
          <h2 className={styles.title}>Événements à Venir</h2>
          <p className={styles.description}>
            Soirées musicales, rencontres vigneronnes et menus éphémères : partagez des moments uniques au cœur de Fabrègues.
          </p>
        </div>

        <div className={styles.grid}>
          {eventsData.map((event, idx) => (
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

                <button
                  type="button"
                  className={styles.reserveBtn}
                  onClick={() => handleReserveEvent(event)}
                >
                  <span>Réserver pour cet événement</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

