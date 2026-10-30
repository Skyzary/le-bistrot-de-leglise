import React from 'react';
import Image from 'next/image';
import styles from './Hero.module.scss';
import { Button } from '@/components/atoms/Button';
import { MapPin } from 'lucide-react';
import { LiveServiceBadge } from '@/components/molecules/LiveServiceBadge';

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image 
          src="/images/interior_1.jpg" 
          alt="Le Bistrot de l'Église Intérieur" 
          fill
          priority
          fetchPriority="high"
          quality={70}
          className={styles.bgImage}
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1920px"
        />
      </div>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.tags}>
          <span className={styles.tag}>
            <MapPin size={14} /> Place de l'Église • Fabrègues
          </span>
          <LiveServiceBadge />
        </div>
        <h1 className={styles.title}>Bienvenue chez vous, au Bistrot de l'Église.</h1>
        <p className={styles.subtitle}>
          Une cuisine simple avec des produits de saison, viandes sélectionnées et fromages de caractère au cœur du village.
        </p>
        <div className={styles.actions}>
          <Button variant="primary" href="#reservation">Réserver une table</Button>
          <Button variant="secondary" href="#menu-overview">La Carte</Button>
        </div>
      </div>
    </section>
  );
};
