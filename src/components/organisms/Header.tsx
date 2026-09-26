'use client';
import React from 'react';
import Link from 'next/link';
import styles from './Header.module.scss';
import { Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* Left: Branding */}
        <Link href="/" className={styles.brand}>
          <img 
            src="/logo.jpg" 
            alt="Logo Le Bistrot de l'Église" 
            className={styles.logoImage} 
          />
          <div className={styles.brandText}>
            <span className={styles.title}>Le Bistrot de l'Église</span>
            <span className={styles.subtitle}>Fabrègues • Accueil</span>
          </div>
        </Link>

        {/* Center/Left Navigation for Desktop */}
        <nav className={styles.desktopNav}>
          <Link href="/#philosophie" className={styles.navLink}>Philosophie</Link>
          <Link href="/menu" className={styles.navLink}>La Carte</Link>
          <Link href="/#nous-trouver" className={styles.navLink}>Nous Trouver</Link>
          <Link href="/#reservation" className={styles.navLink}>Réserver</Link>
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
