import React from 'react';
import styles from './MenuOverview.module.scss';
import { Button } from '@/components/atoms/Button';

import { menuSectionsPreview as menuSections } from '@/config/data';


export const MenuOverview = () => {
  return (
    <section className={styles.section} id="ardoise">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>La Carte du Terroir</h2>
          <p className={styles.subtitle}>Cuisine de saison, viandes sélectionnées & arrivages côtiers</p>
        </div>
        
        <div className={styles.menuGrid}>
          {menuSections.map((section, idx) => (
            <div key={idx} className={styles.menuColumn}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <div className={styles.itemsList}>
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className={styles.menuItem}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemDots}></span>
                      <span className={styles.itemPrice}>{item.price}</span>
                    </div>
                    {item.desc && <p className={styles.itemDesc}>{item.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.action}>
          <Button variant="secondary" href="/menu">Voir la carte complète</Button>
        </div>
      </div>
    </section>
  );
};
