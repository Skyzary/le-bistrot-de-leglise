import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';
import { MapPin } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/atoms/SocialIcons';
import { scheduleData } from '@/config/data';

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
                <InstagramIcon size={20} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100063775170877" aria-label="Facebook" className={styles.socialBtn} target="_blank" rel="noopener noreferrer">
                <FacebookIcon size={20} />
              </a>
              <a href="https://maps.app.goo.gl/gwVypQNT65eDC3mZ8" aria-label="Google Maps" className={styles.socialBtn} target="_blank" rel="noopener noreferrer">
                <MapPin size={20} />
              </a>
            </div>
          </div>

          <div className={styles.infoCol}>
            <span className={styles.label}>Horaires d'Ouverture</span>
            <div className={styles.scheduleList}>
              {scheduleData.map((item, idx) => (
                <div key={idx} className={styles.row}>
                  <span>{item.days}</span>
                  <span className={/ferm[ée]|closed/i.test(item.time) ? styles.closed : styles.time}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Le Bistrot de l'Église. Tous droits réservés.
          </p>
          <div className={styles.legal}>
            <Link href="/mentions-legales">Mentions Légales</Link>
            <span className={styles.dot}>•</span>
            <Link href="/politique-de-confidentialite">Politique de Confidentialité</Link>
            <span className={styles.dot}>•</span>
            <Link href="/cookies">Gestion des Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
