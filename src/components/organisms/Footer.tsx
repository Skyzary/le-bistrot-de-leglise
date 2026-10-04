import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';
import { MapPin } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandCol}>
            <div className={styles.brandGroup}>
              <span className={styles.title}>Le Bistrot de l'Église</span>
              <p className={styles.subtitle}>Bistronomie & convivialité au cœur de Fabrègues.</p>
            </div>

            <div className={styles.addressGroup}>
              <span className={styles.label}>Adresse & Contact</span>
              <p className={styles.text}>
                4 place du 11 novembre 1918, 34690 Fabrègues<br />
                Téléphone : <a href="tel:0434117585" className={styles.link}>04 34 11 75 85</a>
              </p>
            </div>

            <div className={styles.socials}>
              <a href="https://www.instagram.com/lebistrotdeleglise/" aria-label="Instagram" className={styles.socialBtn} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100063775170877" aria-label="Facebook" className={styles.socialBtn} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} />
              </a>
              <a href="https://maps.app.goo.gl/gwVypQNT65eDC3mZ8" aria-label="Google Maps" className={styles.socialBtn} target="_blank" rel="noopener noreferrer">
                <MapPin size={20} />
              </a>
            </div>
          </div>

          <div className={styles.infoCol}>
            <span className={styles.label}>Horaires d'Ouverture</span>
            <div className={styles.row}>
              <span>Lundi – Jeudi</span>
              <span className={styles.time}>08h00 - 00h00</span>
            </div>
            <div className={styles.row}>
              <span>Vendredi – Samedi</span>
              <span className={styles.time}>08h00 - 01h00</span>
            </div>
            <div className={styles.row}>
              <span>Dimanche</span>
              <span className={styles.time}>09h00 - 16h00</span>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.legal}>
            <Link href="/mentions-legales">Mentions Légales</Link>
            <span className={styles.dot}>•</span>
            <Link href="/politique-de-confidentialite">Politique de Confidentialité</Link>
            <span className={styles.dot}>•</span>
            <Link href="/cookies">Cookies</Link>
            <span className={styles.dot}>•</span>
            <span>© {new Date().getFullYear()} Le Bistrot de l'Église</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
