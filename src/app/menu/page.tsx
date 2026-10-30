'use client';
import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { QuickActionMenu } from '@/components/organisms/QuickActionMenu';
import { ChevronLeft, Search, Wine, Dices } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/atoms/ScrollReveal';
import { getWinePairingForDish, WinePairing } from '@/data/winePairings';
import { triggerHaptic } from '@/utils/haptics';
import { fullMenuData as menuData } from '@/config/data';

const WinePairingModal = dynamic(
  () => import('@/components/molecules/WinePairingModal').then((mod) => mod.WinePairingModal),
  { ssr: false }
);

const ChefRouletteModal = dynamic(
  () => import('@/components/molecules/ChefRouletteModal').then((mod) => mod.ChefRouletteModal),
  { ssr: false }
);

const CATEGORIES = ['Toutes', ...menuData.map((c) => c.category)];

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [selectedPairing, setSelectedPairing] = useState<WinePairing | null>(null);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);

  const filteredMenu = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return menuData
      .map((section) => {
        if (activeCategory !== 'Toutes' && section.category !== activeCategory) {
          return null;
        }

        const filteredItems = section.items.filter((item) => {
          if (!query) return true;
          return (
            item.name.toLowerCase().includes(query) ||
            Boolean(item.desc && item.desc.toLowerCase().includes(query))
          );
        });

        if (filteredItems.length === 0) return null;

        return { ...section, items: filteredItems };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);
  }, [activeCategory, searchQuery]);

  const handleOpenPairing = useCallback((pairing: WinePairing) => {
    triggerHaptic('selection');
    setSelectedPairing(pairing);
  }, []);

  const handleClosePairing = useCallback(() => {
    setSelectedPairing(null);
  }, []);

  const handleOpenRoulette = useCallback(() => {
    triggerHaptic('medium');
    setIsRouletteOpen(true);
  }, []);

  const handleCloseRoulette = useCallback(() => {
    setIsRouletteOpen(false);
  }, []);

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ChevronLeft size={24} />
          Retour
        </Link>
        <h1 className={styles.title}>La Carte</h1>
        <p className={styles.subtitle}>Découvrez notre sélection de plats faits maison</p>
        <div>
          <button
            type="button"
            className={styles.rouletteBannerBtn}
            onClick={handleOpenRoulette}
          >
            <Dices size={17} />
            <span>Indécis ? La Roulette du Chef</span>
          </button>
        </div>
      </div>

      <div className={styles.stickyControls}>
        <div className={styles.searchWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Rechercher un plat, un ingrédient..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.categoriesWrapper}>
          <div className={styles.categoriesList}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={activeCategory === cat ? styles.categoryPillActive : styles.categoryPill}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.menuContainer}>
        {filteredMenu.length > 0 ? (
          filteredMenu.map((section, idx) => (
            <ScrollReveal key={idx}>
              <section className={styles.section}>
                <h2 className={styles.categoryTitle}>{section.category}</h2>
                {section.desc && <p className={styles.categoryDesc}>{section.desc}</p>}
                
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
              </section>
            </ScrollReveal>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>Aucun résultat trouvé pour "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className={styles.resetButton}>Réinitialiser la recherche</button>
          </div>
        )}
      </div>

      <WinePairingModal
        pairing={selectedPairing}
        onClose={handleClosePairing}
      />

      <ChefRouletteModal
        isOpen={isRouletteOpen}
        onClose={handleCloseRoulette}
      />

      <Footer />
      <QuickActionMenu />
    </main>
  );
}
