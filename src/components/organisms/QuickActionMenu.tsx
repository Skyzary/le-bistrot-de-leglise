'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './QuickActionMenu.module.scss';
import { Home, BookOpen, MapPin, CalendarRange } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { RouteActionSheet } from '@/components/molecules/RouteActionSheet';

export const QuickActionMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>('');
  const [isRouteSheetOpen, setIsRouteSheetOpen] = useState(false);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;
      // Order is important: bottom-most section first
      const sections = ['reservation', 'nous-trouver', 'menu-overview', 'philosophie'];
      
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
    triggerHaptic('light');
    setActiveSection(sectionId);
    isScrollingRef.current = true;
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  const handleRouteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    setIsRouteSheetOpen(true);
  };

  const handleViewOnSite = () => {
    if (pathname !== '/') {
      router.push('/#nous-trouver');
    } else {
      const el = document.getElementById('nous-trouver');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isMenuPage = pathname === '/menu';
  const isMenu = isMenuPage || (pathname === '/' && activeSection === 'menu-overview');
  const isHome = pathname === '/' && (activeSection === '' || activeSection === 'philosophie');
  const isNousTrouver = pathname === '/' && activeSection === 'nous-trouver';
  const isReservation = pathname === '/' && activeSection === 'reservation';

  return (
    <>
      <nav className={styles.bottomNav}>
        <Link 
          href="/#philosophie" 
          onClick={() => handleNavClick('philosophie')} 
          className={`${styles.navItem} ${isHome && !isMenuPage ? styles.active : ''}`}
        >
          <Home size={24} className={styles.icon} />
          <span>Accueil</span>
        </Link>
        
        <Link 
          href="/menu" 
          onClick={() => handleNavClick('menu-overview')} 
          className={`${styles.navItem} ${isMenu ? styles.active : ''}`}
        >
          <BookOpen size={24} className={styles.icon} />
          <span>La Carte</span>
        </Link>
        
        <button 
          type="button"
          onClick={handleRouteClick}
          className={`${styles.navItem} ${styles.navBtn} ${isNousTrouver && !isMenuPage ? styles.active : ''}`}
          aria-label="Itinéraire et contact"
        >
          <MapPin size={24} className={styles.icon} />
          <span>Itinéraire</span>
        </button>
        
        <Link 
          href="/#reservation" 
          onClick={() => handleNavClick('reservation')} 
          className={`${styles.navItem} ${isReservation && !isMenuPage ? styles.active : ''}`}
        >
          <CalendarRange size={24} className={styles.icon} />
          <span>Réserver</span>
        </Link>
      </nav>

      <RouteActionSheet
        isOpen={isRouteSheetOpen}
        onClose={() => setIsRouteSheetOpen(false)}
        onViewOnSite={handleViewOnSite}
      />
    </>
  );
};
