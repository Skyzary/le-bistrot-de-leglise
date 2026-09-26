import React from 'react';
import Link from 'next/link';
import styles from './QuickActionMenu.module.scss';
import { Home, BookOpen, MapPin, CalendarRange } from 'lucide-react';

export const QuickActionMenu = () => {
  return (
    <nav className={styles.bottomNav}>
      <Link href="/#philosophie" className={styles.navItem}>
        <Home size={24} className={styles.icon} />
        <span>Accueil</span>
      </Link>
      
      <Link href="/menu" className={styles.navItem}>
        <BookOpen size={24} className={styles.icon} />
        <span>La Carte</span>
      </Link>
      
      <Link href="/#nous-trouver" className={styles.navItem}>
        <MapPin size={24} className={styles.icon} />
        <span>Y aller</span>
      </Link>
      
      <Link href="/#reservation" className={styles.navItem}>
        <CalendarRange size={24} className={styles.icon} />
        <span>Réserver</span>
      </Link>
    </nav>
  );
};
