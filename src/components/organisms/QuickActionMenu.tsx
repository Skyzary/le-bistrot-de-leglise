'use client';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import styles from './QuickActionMenu.module.scss';
import { Home, BookOpen, MapPin, CalendarRange } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { useActiveSection } from '@/utils/useActiveSection';

const RouteActionSheet = dynamic(
  () => import('@/components/molecules/RouteActionSheet').then((mod) => mod.RouteActionSheet),
  { ssr: false }
);

export const QuickActionMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { activeSection, setActiveSection } = useActiveSection();
  const [isRouteSheetOpen, setIsRouteSheetOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    triggerHaptic('light');
    setActiveSection(sectionId, 1000);
  };

  const handleRouteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    setIsRouteSheetOpen(true);
  };

  const handleCloseRouteSheet = useCallback(() => {
    setIsRouteSheetOpen(false);
  }, []);

  const handleViewOnSite = useCallback(() => {
    if (pathname !== '/') {
      router.push('/#nous-trouver');
    } else {
      const el = document.getElementById('nous-trouver');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, router]);

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
          prefetch={false}
          onClick={() => handleNavClick('philosophie')} 
          className={`${styles.navItem} ${isHome && !isMenuPage ? styles.active : ''}`}
        >
          <Home size={24} className={styles.icon} />
          <span>Accueil</span>
        </Link>
        
        <Link 
          href="/menu" 
          prefetch={false}
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
          prefetch={false}
          onClick={() => handleNavClick('reservation')} 
          className={`${styles.navItem} ${isReservation && !isMenuPage ? styles.active : ''}`}
        >
          <CalendarRange size={24} className={styles.icon} />
          <span>Réserver</span>
        </Link>
      </nav>

      {isRouteSheetOpen && (
        <RouteActionSheet
          isOpen={isRouteSheetOpen}
          onClose={handleCloseRouteSheet}
          onViewOnSite={handleViewOnSite}
        />
      )}
    </>
  );
};
