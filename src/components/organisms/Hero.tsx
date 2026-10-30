'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.scss';
import { Button } from '@/components/atoms/Button';
import { MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { LiveServiceBadge } from '@/components/molecules/LiveServiceBadge';
import { eventsData, themeData } from '@/config/data';

export const Hero = () => {
  const featuredEvent = eventsData && eventsData.length > 0 ? eventsData[0] : null;
  const isHalloween = themeData.mode === 'halloween';
  const isNoel = themeData.mode === 'noel';
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTitleClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      window.location.href = '/admin/';
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image 
          src="/images/interior_1.jpg" 
          alt="Le Bistrot de l'Église Intérieur" 
          fill
          priority
          fetchPriority="high"
          quality={65}
          className={styles.bgImage}
          sizes="(max-width: 640px) 75vw, (max-width: 1200px) 90vw, 1920px"
        />
      </div>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.tags}>
          {isHalloween && (
            <span className={styles.halloweenPill}>
              🎃 SAMEDI SOIR : SOIRÉE HALLOWEEN • VENEZ DÉGUISÉS ! 🧛‍♂️
            </span>
          )}
          {isNoel && (
            <span className={styles.noelPill}>
              🎄 AMBIANCE DES FÊTES • TABLE CHALEUREUSE AU CŒUR DU VILLAGE ✨
            </span>
          )}
          <span className={styles.tag}>
            <MapPin size={14} /> Place de l&apos;Église • Fabrègues
          </span>
          <LiveServiceBadge />
        </div>
        <h1
          className={styles.title}
          onClick={handleTitleClick}
          style={{ cursor: 'pointer', userSelect: 'none' }}
          title="Le Bistrot de l'Église"
        >
          {isHalloween
            ? "Bienvenue chez vous, au Bistrot de l'Église 🎃"
            : isNoel
              ? "Bienvenue chez vous, au Bistrot de l'Église 🎄"
              : "Bienvenue chez vous, au Bistrot de l'Église"}
        </h1>
        {isHalloween ? (
          <p className={styles.subtitle}>
            🍬 <strong>Bonbons pour les petits</strong> &amp; 😈 <strong>Shooter du Diablotin pour les adultes !</strong> Cuisine de saison, viandes sélectionnées et ambiance ensorcelante au cœur du village.
          </p>
        ) : isNoel ? (
          <p className={styles.subtitle}>
            ✨ <strong>Une parenthèse chaleureuse et gourmande pour les fêtes :</strong> cuisine maison de saison, viandes sélectionnées et grands vins d&apos;Occitanie au cœur de Fabrègues.
          </p>
        ) : (
          <p className={styles.subtitle}>
            Une table chaleureuse au cœur du village. Cuisine de saison, viandes sélectionnées et convivialité sincère, midi et soir.
          </p>
        )}
        <div className={styles.actions}>
          <Button variant="primary" href="#reservation">
            {isHalloween
              ? '🎃 Réserver pour Halloween'
              : isNoel
                ? '🎄 Réserver une table'
                : 'Réserver une table'}
          </Button>
          <Button variant="secondary" href={isHalloween ? '#evenements' : '#ardoise'}>
            {isHalloween
              ? "🦇 Voir l'affiche"
              : isNoel
                ? '🥂 Découvrir la carte'
                : "Découvrir l'ardoise"}
          </Button>
        </div>
        {featuredEvent && (
          <a href="#evenements" className={styles.eventTeaser}>
            <Sparkles size={14} className={styles.eventTeaserIcon} />
            <span className={styles.eventTeaserText}>
              <strong>{featuredEvent.date} :</strong> {featuredEvent.title}
            </span>
            <ArrowRight size={14} className={styles.eventTeaserArrow} />
          </a>
        )}
      </div>
    </section>
  );
};
