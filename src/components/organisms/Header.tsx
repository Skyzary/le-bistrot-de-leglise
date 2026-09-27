'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.scss';
import { Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

export const Header = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      if (isScrollingRef.current) return; // Skip if we are programmatically scrolling
      
      const sections = ['reservation', 'nous-trouver', 'philosophie'];
      if (window.scrollY < 100) {
        setActiveSection('');
        return;
      }
      
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2.5) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    isScrollingRef.current = true;
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000); // 1 second pause while smooth scrolling finishes
  };

  const isMenu = pathname === '/menu';
  const isPhilosophie = pathname === '/' && (activeSection === '' || activeSection === 'philosophie');
  const isNousTrouver = pathname === '/' && activeSection === 'nous-trouver';
  const isReservation = pathname === '/' && activeSection === 'reservation';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* Left: Branding */}
        <Link href="/" className={styles.brand}>
          <Image 
            src="/logo.jpg" 
            alt="Logo Le Bistrot de l'Église" 
            width={36}
            height={36}
            className={styles.logoImage} 
            priority
          />
          <div className={styles.brandText}>
            <span className={styles.title}>Le Bistrot de l'Église</span>
            <span className={styles.subtitle}>Fabrègues • Accueil</span>
          </div>
        </Link>

        {/* Center/Left Navigation for Desktop */}
        <nav className={styles.desktopNav}>
          <Link href="/#philosophie" onClick={() => handleNavClick('philosophie')} className={`${styles.navLink} ${isPhilosophie && !isMenu ? styles.active : ''}`}>Philosophie</Link>
          <Link href="/menu" onClick={() => handleNavClick('menu')} className={`${styles.navLink} ${isMenu ? styles.active : ''}`}>La Carte</Link>
          <Link href="/#nous-trouver" onClick={() => handleNavClick('nous-trouver')} className={`${styles.navLink} ${isNousTrouver && !isMenu ? styles.active : ''}`}>Nous Trouver</Link>
          <Link href="/#reservation" onClick={() => handleNavClick('reservation')} className={`${styles.navLink} ${isReservation && !isMenu ? styles.active : ''}`}>Réserver</Link>
        </nav>

        {/* Right: Actions */}
        <div className={styles.actions}>
          <a href="https://www.instagram.com/lebistrotdeleglise/" className={styles.iconBtn} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={18} />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100063775170877" className={styles.iconBtn} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={18} />
          </a>
          <a href="https://maps.app.goo.gl/gwVypQNT65eDC3mZ8" className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label="Google Maps" target="_blank" rel="noopener noreferrer">
            <MapPin size={18} />
          </a>
          <a href="tel:0434117585" className={styles.iconBtn} aria-label="Appeler le 04 34 11 75 85">
            <Phone size={18} />
          </a>
        </div>
        
      </div>
    </header>
  );
};
