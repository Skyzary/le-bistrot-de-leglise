'use client';

import React, { useRef } from "react";
import Image from "next/image";
import styles from "./Hero.module.scss";
import { Button } from "@/components/atoms/Button";
import { MapPin } from "lucide-react";
import { RestaurantStatusBadge } from "@/components/atoms/RestaurantStatusBadge";
import { scheduleData } from "@/config/data";

export const Hero = () => {
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

    // Reset counter if no click within 2 seconds
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);
  };

  return (
    <section className={styles.hero}>
      <Image
        src="/images/interior_1.jpg"
        alt="Le Bistrot de l'Église Intérieur"
        fill
        priority
        className={styles.bgImage}
        sizes="100vw"
      />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.tags}>
          <span className={styles.tag}>
            <MapPin size={14} /> Place de l'Église • Fabrègues
          </span>
          <RestaurantStatusBadge schedule={scheduleData} />
        </div>
        <h1 
          className={styles.title} 
          onClick={handleTitleClick}
          style={{ cursor: 'pointer', userSelect: 'none' }}
          title="Le Bistrot de l'Église"
        >
          Bienvenue chez vous, au Bistrot de l'Église.
        </h1>
        <p className={styles.subtitle}>
          Une cuisine simple avec des produits de saison, viandes sélectionnées
          et fromages de caractère au cœur du village.
        </p>
        <div className={styles.actions}>
          <Button variant="primary" href="#reservation">
            Réserver une table
          </Button>
          <Button variant="secondary" href="#ardoise">
            L'Ardoise
          </Button>
        </div>
      </div>
    </section>
  );
};
