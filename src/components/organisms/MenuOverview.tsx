'use client';

import React, { useState } from 'react';
import styles from './MenuOverview.module.scss';
import { Button } from '@/components/atoms/Button';
import { Wine, Dices } from 'lucide-react';
import { WinePairingModal } from '@/components/molecules/WinePairingModal';
import { ChefRouletteModal } from '@/components/molecules/ChefRouletteModal';
import { getWinePairingForDish, WinePairing } from '@/data/winePairings';
import { triggerHaptic } from '@/utils/haptics';

const menuSections = [
  {
    title: 'Les plats de saison',
    items: [
      { name: 'Parmentier de canard, patate douce', price: '19.50 €' },
      { name: 'Joue de bœuf au cidre de pommes', price: '19.50 €', desc: 'Et gratin de pommes de terre' },
      { name: 'Côte de porc aveyronnaise', price: '19.50 €', desc: 'Sauce miel-moutarde' }
    ]
  },
  {
    title: 'Nos incontournables',
    items: [
      { name: 'Magret de canard 300/350g', price: '23.90 €' },
      { name: 'Bourride de poisson et ses filets', price: '25.00 €', desc: 'Gratinés de rouille maison' },
      { name: 'Le BISTROT\'S Burger', price: '21.00 €', desc: 'Viandard + 2 tranches St Nectaire' }
    ]
  }
];

export const MenuOverview = () => {
  const [selectedPairing, setSelectedPairing] = useState<WinePairing | null>(null);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);

  const handleOpenPairing = (pairing: WinePairing) => {
    triggerHaptic('selection');
    setSelectedPairing(pairing);
  };

  return (
    <section className={styles.section} id="menu-overview">
      <span id="ardoise" style={{ position: 'relative', top: '-80px', display: 'block', visibility: 'hidden' }} />
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
                {section.items.map((item, itemIdx) => {
                  const pairing = getWinePairingForDish(item.name);
                  return (
                    <div key={itemIdx} className={styles.menuItem}>
                      <div className={styles.itemHeader}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemDots}></span>
                        <span className={styles.itemPrice}>{item.price}</span>
                      </div>
                      {item.desc && <p className={styles.itemDesc}>{item.desc}</p>}
                      {pairing && (
                        <button
                          type="button"
                          className={styles.sommelierBtn}
                          onClick={() => handleOpenPairing(pairing)}
                          aria-label={`Accord vin pour ${item.name}`}
                        >
                          <Wine size={12} />
                          <span>Accord sommelier : {pairing.wineName} ({pairing.appellation})</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.action}>
          <button
            type="button"
            className={styles.rouletteTriggerBtn}
            onClick={() => {
              triggerHaptic('medium');
              setIsRouletteOpen(true);
            }}
          >
            <Dices size={18} />
            <span>La Roulette du Chef</span>
          </button>
          <Button variant="secondary" href="/menu">Voir la carte complète</Button>
        </div>
      </div>

      <WinePairingModal
        pairing={selectedPairing}
        onClose={() => setSelectedPairing(null)}
      />

      <ChefRouletteModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
      />
    </section>
  );
};
