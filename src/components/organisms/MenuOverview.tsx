import React from 'react';
import styles from './MenuOverview.module.scss';
import { Button } from '@/components/atoms/Button';

const menuSections = [
  {
    title: 'Côté Terre',
    items: [
      { name: 'Pièce du Boucher', price: '23.50 €', desc: 'Selon arrivage +/- 350G' },
      { name: 'Magret de Canard', price: '19.90 €', desc: '+/- 350G' },
      { name: 'Tartare de Boeuf', price: '17.00 €', desc: 'Coupé au couteau 180gr' }
    ]
  },
  {
    title: 'Côté Mer',
    items: [
      { name: 'Seiches Grillées', price: '19.00 €', desc: 'Seiches en persillade' },
      { name: 'Steack de Thon', price: '21.00 €', desc: '+/- 250G' },
      { name: 'Tartare de Thon', price: '21.00 €', desc: 'Aux notes fraiches et exotiques' }
    ]
  }
];

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
