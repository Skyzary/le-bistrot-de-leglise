import React from 'react';
import styles from './TourismDiscovery.module.scss';
import { Compass, Church, Castle, Waves, Mountain } from 'lucide-react';

export const TourismDiscovery = () => {
  return (
    <section className={styles.section} id="nous-trouver">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tag}>
            <Compass size={18} />
            <span>Idéalement Situé</span>
          </div>
          <h2 className={styles.title}>Aux portes de Montpellier</h2>
          <p className={styles.description}>
            À quelques minutes seulement de <strong>Pignan, Saussan, Saint-Jean-de-Védas et Cournonterral</strong>, le bistrot est la halte déjeuner parfaite avant ou après votre promenade.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <Church size={18} className={styles.icon} />
            <span>Abbaye St-Félix</span>
          </div>
          <div className={styles.card}>
            <Castle size={18} className={styles.icon} />
            <span>Château l'Engarran</span>
          </div>
          <div className={styles.card}>
            <Waves size={18} className={styles.icon} />
            <span>Salines Villeneuve</span>
          </div>
          <div className={styles.card}>
            <Mountain size={18} className={styles.icon} />
            <span>Massif de la Gardiole</span>
          </div>
        </div>

        <div className={styles.mapWrapper}>
          <iframe 
            title="Carte Le Bistrot de l'Église"
            src="https://maps.google.com/maps?q=Le%20Bistrot%20de%20l'Eglise,%204%20place%20du%2011%20novembre%201918,%2034690%20Fabr%C3%A8gues&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};
