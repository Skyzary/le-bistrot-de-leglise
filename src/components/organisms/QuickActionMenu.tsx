'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './QuickActionMenu.module.scss';
import { Home, BookOpen, MapPin, CalendarRange } from 'lucide-react';

export const QuickActionMenu = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;
      // Order is important: bottom-most section first
      const sections = ['reservation', 'nous-trouver', 'philosophie'];
      
      if (window.scrollY < 100) {
        setActiveSection('');
        return;
      }
      
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If section is above the middle of viewport
          if (rect.top <= window.innerHeight / 2.5) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    isScrollingRef.current = true;
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  const isMenu = pathname === '/menu';
  const isHome = pathname === '/' && (activeSection === '' || activeSection === 'philosophie');
  const isNousTrouver = pathname === '/' && activeSection === 'nous-trouver';
  const isReservation = pathname === '/' && activeSection === 'reservation';

  return (
    <nav className={styles.bottomNav}>
      <Link href="/#philosophie" onClick={() => handleNavClick('philosophie')} className={`${styles.navItem} ${isHome && !isMenu ? styles.active : ''}`}>
        <Home size={24} className={styles.icon} />
        <span>Accueil</span>
      </Link>
      
      <Link href="/menu" onClick={() => handleNavClick('menu')} className={`${styles.navItem} ${isMenu ? styles.active : ''}`}>
        <BookOpen size={24} className={styles.icon} />
        <span>La Carte</span>
      </Link>
      
      <Link href="/#nous-trouver" onClick={() => handleNavClick('nous-trouver')} className={`${styles.navItem} ${isNousTrouver && !isMenu ? styles.active : ''}`}>
        <MapPin size={24} className={styles.icon} />
        <span>Y aller</span>
      </Link>
      
      <Link href="/#reservation" onClick={() => handleNavClick('reservation')} className={`${styles.navItem} ${isReservation && !isMenu ? styles.active : ''}`}>
        <CalendarRange size={24} className={styles.icon} />
        <span>Réserver</span>
      </Link>
    </nav>
  );
};
