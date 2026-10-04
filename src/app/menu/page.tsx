'use client';
import React, { useState } from 'react';
import styles from './page.module.scss';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { QuickActionMenu } from '@/components/organisms/QuickActionMenu';
import { ChevronLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/atoms/ScrollReveal';

import { fullMenuData } from '@/config/data';

const menuData = fullMenuData;


export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Toutes');

  const categories = ['Toutes', ...menuData.map(c => c.category)];

  const filteredMenu = menuData.map(section => {
    if (activeCategory !== 'Toutes' && section.category !== activeCategory) {
      return null;
    }

    const filteredItems = section.items.filter(item => {
      const query = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(query) || (item.desc && item.desc.toLowerCase().includes(query));
    });

    if (filteredItems.length === 0) return null;

    return { ...section, items: filteredItems };
  }).filter(Boolean);

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
            {categories.map((cat) => (
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
                <h2 className={styles.categoryTitle}>{section!.category}</h2>
                {section!.desc && <p className={styles.categoryDesc}>{section!.desc}</p>}
                
                <div className={styles.itemsList}>
                  {section!.items.map((item, itemIdx) => (
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

      <Footer />
      <QuickActionMenu />
    </main>
  );
}
