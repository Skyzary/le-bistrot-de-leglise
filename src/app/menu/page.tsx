'use client';
import React, { useState } from 'react';
import styles from './page.module.scss';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { QuickActionMenu } from '@/components/organisms/QuickActionMenu';
import { ChevronLeft, Search } from 'lucide-react';
import Link from 'next/link';

const menuData = [
  {
    category: 'Côté Terre',
    items: [
      { name: 'Pièce du Boucher', price: '23.50 €', desc: 'Selon arrivage +/- 350G' },
      { name: 'Magret de Canard', price: '19.90 €', desc: '+/- 350G' },
      { name: 'Andouillettes de Troyes', price: '16.50 €', desc: 'En simple (En double 21.00 €)' },
      { name: 'Filet de Poulet', price: '17.50 €', desc: 'Crème de champignons / Risotto' },
      { name: 'Burger Viande d\'Aubrac', price: '14.50 €', desc: 'En simple (En double 19.00 €)' },
      { name: 'Tartare de Boeuf', price: '17.00 €', desc: 'Coupé au couteau 180gr' }
    ]
  },
  {
    category: 'Côté Mer',
    items: [
      { name: 'Seiches Grillées', price: '19.00 €', desc: 'Seiches en persillade' },
      { name: 'Steack de Thon', price: '21.00 €', desc: '+/- 250G' },
      { name: 'Gambas Sauvages', price: '19.50 €', desc: 'Grillées en persillade, maille 10/20' },
      { name: 'Tartare de Thon', price: '21.00 €', desc: 'Aux notes fraiches et exotiques' },
      { name: 'Cuisses de Grenouilles', price: '17.90 €', desc: 'Farinées puis en persillade' },
      { name: 'Burger de Thon', price: '14.50 €', desc: 'Mayonnaise au wasabi et pickels' },
      { name: 'Parillada de la Mer', price: '25.00 €', desc: 'Seiches grillées, thon et gambas sauvages' }
    ]
  },
  {
    category: 'Les Marmites de Mamie',
    desc: 'Cuisinées à feux doux, en marmite comme nos grands-mères. Accompagnées de riz camarguais évidemment.',
    items: [
      { name: 'Rouille de Seiche', price: '15.50 €' },
      { name: 'Blanquette de Veau', price: '18.50 €' },
      { name: 'Gardianne de Taureau', price: '15.50 €' },
      { name: 'Légumes Farcis de Saison', price: '15.50 €' },
      { name: 'Rognons de Veau à la Vigneronne', price: '18.50 €' },
      { name: 'Épaule d\'Agneau', price: '20.50 €' }
    ]
  },
  {
    category: 'Nos Tapas',
    desc: 'Servis avec son pain / de 11h00 à 23h00',
    items: [
      { name: 'Cecina de Laon IGP', price: '8.00 €', desc: 'Bœuf séché & fumé au hêtre' },
      { name: 'Serrano 24 mois', price: '8.00 €', desc: 'Affinage, nourri aux châtaignes' },
      { name: 'Saucisson Duroc', price: '8.00 €', desc: 'Élevé aux châtaignes' },
      { name: 'Soubressade de Murcia', price: '8.00 €' },
      { name: 'Perche Aveyronnaise', price: '8.00 €' },
      { name: 'Jambon blanc à la truffe Italie', price: '8.00 €' },
      { name: 'Caviar d\'Aubergines maison', price: '8.00 €' },
      { name: 'Houmous maison', price: '8.00 €' },
      { name: 'Maïs Grillé au beurre', price: '8.00 €' },
      { name: 'Pain de Campagne Grillé', price: '8.00 €', desc: '& son confit d\'ail maison' },
      { name: 'Poivrons Marinés maison', price: '8.00 €' },
      { name: 'Oeufs Mimosa maison', price: '8.00 €' },
      { name: 'Gésiers de Volaille gratinés', price: '8.00 €' },
      { name: 'Sardines Marinées la brujula Galice', price: '8.00 €' },
      { name: 'La Buratta AOP', price: '8.00 €', desc: '& son huile d\'olive Fatima' },
      { name: 'Jambon Bellota 36 mois', price: '15.00 €', desc: 'Guijuelo élevé en plein air et nourri aux châtaignes' }
    ]
  },
  {
    category: 'Salades',
    items: [
      { name: 'Caesar', price: '15.00 €', desc: 'Salade filet de poulet français & son oeuf poché' },
      { name: 'Salade Gésiers de Volaille', price: '15.00 €' },
      { name: 'Salade du moment', price: '15.00 €' },
      { name: 'En Duo Croque Monsieur et Madame', price: '15.00 €', desc: 'Jambon à la truffe' }
    ]
  },
  {
    category: 'Menu Enfant',
    items: [
      { name: 'Formule Enfant', price: '9.90 €', desc: '1 sirop + burger/steack/filet de poulet + 1 boule de glace' }
    ]
  },
  {
    category: 'Fromages & Desserts',
    items: [
      { name: 'Fondant au Chocolat', price: '7.00 €' },
      { name: 'Brioche façon pain perdu', price: '7.00 €' },
      { name: 'Crème Brulée', price: '7.00 €' },
      { name: 'Carpaccio d\'Ananas', price: '7.00 €' },
      { name: 'Assiette de Fromages', price: '9.00 €', desc: 'Sélection de fromages au lait cru' }
    ]
  },
  {
    category: 'Softs & Eaux',
    items: [
      { name: 'Coca-Cola (Classique, Sans sucre, Cherry)', price: '3.50 €', desc: '33cl' },
      { name: 'Fanta, Sprite, FuzeTea, Tropico', price: '3.50 €', desc: '25cl' },
      { name: 'Jus de fruit', price: '3.50 €', desc: 'Orange, ace, fraise, tomate, ananas, pomme, abricot' },
      { name: 'Diabolo et limonade', price: '3.00 €' },
      { name: 'Vittel / Eau pétillante', price: '5.00 €', desc: '1L (1/4 Vittel 3.50 €)' }
    ]
  },
  {
    category: 'Bières',
    items: [
      { name: 'Stella (Pression)', price: '3.00 €', desc: '25cl (50cl 5.60 €)' },
      { name: 'Leffe (Pression)', price: '3.80 €', desc: '25cl (50cl 7.30 €) - Bière d\'abbaye belge' },
      { name: 'Hoegaarden (Pression)', price: '3.80 €', desc: '25cl (50cl 7.30 €) - Bière blanche' },
      { name: 'Fada IPA (Pression)', price: '3.80 €', desc: '25cl (50cl 7.30 €) - Bière de Provence' },
      { name: 'Heineken / Desperados', price: '4.00 € / 5.50 €', desc: 'Bouteille' }
    ]
  },
  {
    category: 'Vins',
    items: [
      { name: 'Blanc - IGP OC Chardonnay / Viognier', price: '4.00 €', desc: 'Verre (Bouteille 14.00 €)' },
      { name: 'Rosé - IGP Côte de Thau Gemme', price: '3.50 €', desc: 'Verre (Bouteille 13.00 €)' },
      { name: 'Rouge - IGP OC Typiquement Carignan', price: '4.00 €', desc: 'Verre (Bouteille 14.00 €)' }
    ]
  },
  {
    category: 'Cocktails',
    items: [
      { name: 'Caïpirinha', price: '8.00 €', desc: 'Cachaça, citron vert, sucre de canne' },
      { name: 'Piña Colada', price: '8.00 €', desc: 'Rhum blanc, rhum ambré, jus d\'ananas, jus de coco' },
      { name: 'Spritz', price: '8.00 €', desc: 'Bitter rouge, prosecco et eau pétillante' },
      { name: 'Negroni', price: '9.00 €', desc: 'Martini rouge, bitter rouge et gin' },
      { name: 'French Mule', price: '9.00 €', desc: 'Cognac, citron vert, sucre, eau pétillante' }
    ]
  }
];


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
              <section key={idx} className={styles.section}>
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
