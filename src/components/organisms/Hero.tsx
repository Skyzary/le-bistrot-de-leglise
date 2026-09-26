import React from 'react';
import styles from './Hero.module.scss';
import { Button } from '@/components/atoms/Button';
import { MapPin } from 'lucide-react';

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.tags}>
          <span className={styles.tag}>
            <MapPin size={14} /> Place de l'Église • Fabrègues
          </span>
          <span className={styles.tagActive}>Ouvert aujourd'hui</span>
        </div>
        <h1 className={styles.title}>Bienvenue chez vous, au Bistrot de l'Église.</h1>
        <p className={styles.subtitle}>
          Une cuisine simple avec des produits de saison, viandes sélectionnées et fromages de caractère au cœur du village.
        </p>
        <div className={styles.actions}>
          <Button variant="primary" href="#reservation">Réserver une table</Button>
          <Button variant="secondary" href="#ardoise">L'Ardoise</Button>
        </div>
      </div>
    </section>
  );
};
