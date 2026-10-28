'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.scss';
import { Button } from '@/components/atoms/Button';
import { MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LiveServiceBadge } from '@/components/molecules/LiveServiceBadge';

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  return (
    <section className={styles.hero} ref={sectionRef}>
      <motion.div 
        style={{ y, position: 'absolute', inset: 0, scale: 1.08, zIndex: 0 }}
      >
        <Image 
          src="/images/interior_1.jpg" 
          alt="Le Bistrot de l'Église Intérieur" 
          fill
          priority
          className={styles.bgImage}
          sizes="100vw"
        />
      </motion.div>
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
