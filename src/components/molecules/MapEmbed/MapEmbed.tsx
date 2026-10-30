'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './MapEmbed.module.scss';
import { MapPin } from 'lucide-react';

interface MapEmbedProps {
  src: string;
  title: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({ src, title }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.mapContainer}>
      {shouldLoad ? (
        <iframe
          title={title}
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className={styles.placeholder} onClick={() => setShouldLoad(true)}>
          <MapPin size={28} className={styles.pinIcon} />
          <span>Chargement de la carte...</span>
        </div>
      )}
    </div>
  );
};
