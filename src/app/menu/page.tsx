'use client';
import React, { useState } from 'react';
import styles from './page.module.scss';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { QuickActionMenu } from '@/components/organisms/QuickActionMenu';
import { ChevronLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/atoms/ScrollReveal';

const menuData = [
  {
    category: 'Midi uniquement (Lundi au vendredi)',
    items: [
      { name: 'Cuisse de poulet 240g', price: '9.50 €', desc: 'Frites fraîches' },
      { name: 'Formule', price: '10.50 €', desc: 'Quiche + salade' },
      { name: 'Plat du jour', price: '11.90 €' }
    ]
  },
  {
    category: 'Entrées',
    items: [
      { name: 'Salade croquant Saint-Nectaire et poire', price: '8.00 €', desc: 'Ou en salade repas (15.00 €)' },
      { name: 'Bouchée à la reine poulet champignons', price: '8.00 €' },
      { name: 'Œuf poché, sauce marchand de vin', price: '7.00 €' },
      { name: 'Terrine de chasse', price: '7.00 €' },
      { name: 'Quiche du moment', price: '7.50 €' },
      { name: 'Soupe de poisson artisanale', price: '10.00 €' }
    ]
  },
  {
    category: 'Les plats de saison',
    items: [
      { name: 'Parmentier de canard, patate douce', price: '19.50 €' },
      { name: 'Joue de bœuf au cidre de pommes', price: '19.50 €', desc: 'Et gratin de pommes de terre' },
      { name: 'Côte de porc aveyronnaise', price: '19.50 €', desc: 'Sauce miel-moutarde, gratins de pommes de terre' }
    ]
  },
  {
    category: 'Le plat du monde',
    items: [
      { name: 'Poulet THAÏ', price: '17.50 €', desc: 'Sauce THAÏ, riz THAÏ' }
    ]
  },
  {
    category: 'Plats - Nos incontournables',
    desc: 'Salade de saison + 1 Accompagnement au choix : frites fraîches FRANÇAISE ou gratins de pommes de terre ou poivrons marinés. Garnitures supplémentaires 4€.',
    items: [
      { name: 'Seiches grillées en persillade, aïoli', price: '19.00 €' },
      { name: 'Magret de canard 300/350g', price: '23.90 €' },
      { name: 'Demi magret de canard', price: '15.00 €' },
      { name: 'Encornets farcis et riz camarguais', price: '18.00 €' },
      { name: 'Bourride de poisson et ses filets', price: '25.00 €', desc: 'Gratinés de rouille maison' }
    ]
  },
  {
    category: 'Les burgers',
    desc: 'Nos Burgers de viande de bœuf FRANÇAISE avec frites fraiches FRANÇAISE et salade FRANÇAISE',
    items: [
      { name: 'Burger à la viteuf', price: '9.50 €', desc: 'Viande 150g, ketchup. Idéal pour combler un p’ti creux' },
      { name: 'Burger fromage classique', price: '14.50 €', desc: '2 tranches de Cheddar, 150g de viande, tomate, salade, oignons, ketchup' },
      { name: 'Burger espagnol', price: '17.50 €', desc: 'Base classique + CHORIZO ET POIVRONS' },
      { name: 'Burger Le prés de ses sous', price: '16.50 €', desc: 'Base classique + ROQUEFORT PAPILLON' },
      { name: 'Burger Le Bougnat', price: '16.50 €', desc: 'Base classique + Tranches de SAINT NECTAIRE FERMIER' },
      { name: 'Burger Le Viandard', price: '19.50 €', desc: 'Base classique + DOUBLE STEAK FRANÇAIS 300g' },
      { name: 'Le BISTROT\'S Burger', price: '21.00 €', desc: 'Le Viandard + 2 tranches de SAINT NECTAIRE & lards' },
      { name: 'Burger LOVE THE VEGAN', price: '14.50 €', desc: 'Base classique OFF THE MEAT + croustillant de légumes, poivrons marinés' }
    ]
  },
  {
    category: 'Les Tapas (À la pièce - 8€)',
    items: [
      { name: 'Œuf mimosa', price: '8.00 €' },
      { name: 'Perche aveyronnaise', price: '8.00 €' },
      { name: 'Caviar d’aubergine', price: '8.00 €' },
      { name: 'Confit d’ail', price: '8.00 €' },
      { name: 'Crevettes à l’ail', price: '8.00 €' },
      { name: 'Pâté de campagne', price: '8.00 €' },
      { name: 'Abats du moment', price: '8.00 €' },
      { name: 'Sobressada', price: '8.00 €' },
      { name: 'Houmous', price: '8.00 €' },
      { name: 'Poivrons marinés', price: '8.00 €' },
      { name: 'Pain au saint-nectaire', price: '8.00 €' },
      { name: 'Crevettes exotiques', price: '8.00 €' }
    ]
  },
  {
    category: 'Les Charcuteries & Planches',
    desc: 'Sélection de charcuterie Aveyronnaise, Italienne et Espagnole. Sélection de tapas à partager.',
    items: [
      { name: 'PLANCHE (Mix de tapas)', price: '20.00 €', desc: '2/3 personnes' },
      { name: 'PLANCHE XL (Mix généreux)', price: '59.00 €', desc: '6/8 personnes' },
      { name: 'PLANCHE XXL (Pour le partage)', price: '99.00 €', desc: '10 personnes' }
    ]
  },
  {
    category: 'Menu enfant',
    items: [
      { name: 'Menu enfant', price: '9.90 €', desc: '1 sirop + nuggets/steak/burger (supp 1,50 €) + 1 boule de glace' }
    ]
  },
  {
    category: 'Les desserts',
    items: [
      { name: 'Assiette de fromages', price: '9.00 €', desc: 'Sélection de fromages au lait cru' },
      { name: 'Profiteroles', price: '8.00 €' },
      { name: 'Tiramisu du moment', price: '8.00 €' },
      { name: 'Coulant au chocolat', price: '8.00 €' },
      { name: 'Brioche perdue', price: '8.00 €' },
      { name: 'Desserts du moment MAISON', price: '8.00 €' }
    ]
  },
  {
    category: 'Softs',
    items: [
      { name: 'Bouteille en verre', price: '3.50 €', desc: 'Coca, Coca sans sucre, Coca cherry, Fanta, Fuze tea, Sprite, Tropico, Schweppes, Orangina' },
      { name: 'Jus de fruits', price: '3.50 €', desc: 'Orange, ace, fraise, tomate, ananas, pomme, abricot' },
      { name: 'Sirop', price: '2.00 €', desc: 'Fraise, grenadine, pêche, anis, menthe, violette, orange, citron, cerise, orgeat' },
      { name: 'Diabolo et limonade', price: '3.00 €' },
      { name: 'Canette à emporter', price: '2.50 €' },
      { name: 'Bouteille Coca-Cola 1,25L / 2,00L (Sur place)', price: '6.00 €' },
      { name: 'Bouteille Coca-Cola 1,25L / 2,00L (À emporter)', price: '4.00 €' }
    ]
  },
  {
    category: 'Eaux minérales',
    items: [
      { name: 'Vittel (Litre)', price: '5.00 €' },
      { name: '¼ Vittel', price: '3.50 €' },
      { name: 'Eau de Perrier', price: '3.50 €' },
      { name: 'Eau pétillante (50cl)', price: '3.50 €' },
      { name: 'Eau pétillante (Litre)', price: '5.00 €' }
    ]
  },
  {
    category: 'Boissons chaudes',
    items: [
      { name: 'Café, Expresso, Décaféiné, Allongé', price: '1.50 €' },
      { name: 'Noisette', price: '1.60 €' },
      { name: 'Double café, Thé', price: '2.80 €' },
      { name: 'Cappucino', price: '3.50 €' },
      { name: 'Grand crème', price: '3.50 €' },
      { name: 'Chocolat chaud', price: '3.50 €' },
      { name: 'Café frappé', price: '4.00 €' },
      { name: 'Café arrosé', price: '3.50 €' }
    ]
  },
  {
    category: 'Bières',
    items: [
      { name: 'Stella (Pression)', price: '3.20 €', desc: '25cl (50cl 5.90 €)' },
      { name: 'Leffe (Pression)', price: '3.80 €', desc: '25cl (50cl 7.30 €)' },
      { name: 'Hoegaarden (Pression)', price: '3.80 €', desc: '25cl (50cl 7.30 €)' },
      { name: 'Fada IPA (Pression)', price: '3.80 €', desc: '25cl (50cl 7.30 €)' },
      { name: 'Heineken / Biere du moment', price: '4.00 €', desc: 'À la bouteille' },
      { name: 'Desperados', price: '5.50 €', desc: 'À la bouteille' },
      { name: 'Biere sans alcool', price: '4.00 €', desc: 'À la bouteille' }
    ]
  },
  {
    category: 'Vins',
    items: [
      { name: 'Blanc - IGP OC Chardonnay / Viognier', price: '4.00 €', desc: 'Verre (Bouteille 14.00 €)' },
      { name: 'Rosé - IGP Côte de Thau Gemme', price: '3.50 €', desc: 'Verre (Bouteille 14.00 €)' },
      { name: 'Rouge - IGP OC Typiquement Carigna', price: '4.00 €', desc: 'Verre (Bouteille 14.00 €)' },
      { name: 'Vin blanc, rouge ou rosé (Pichet 25cl)', price: '3.00 €', desc: 'Verre 12,5cl 3.00 €' },
      { name: 'Vin blanc, rouge ou rosé (Pichet 50cl)', price: '3.00 €' }
    ]
  },
  {
    category: 'Apéritifs',
    items: [
      { name: 'Ricard, Pastis, Casanis', price: '2.50 €', desc: '2cl' },
      { name: 'Moresque, Tomate, Perroquet', price: '2.50 €', desc: '2cl' },
      { name: 'Baby Rhum Spiced', price: '3.50 €', desc: '2cl' },
      { name: 'Vodka, Gin', price: '3.50 €', desc: '2cl' },
      { name: 'Whisky Gamme Tessendier France', price: '3.50 €', desc: '2cl' },
      { name: 'Double 4cl Gamme Tessendier', price: '6.00 €' },
      { name: 'Red Label, Clan Campbell', price: '4.50 €', desc: '2cl' },
      { name: 'Bacardi, Bacardi Oro, Havana', price: '4.50 €', desc: '2cl' },
      { name: 'Grey Goose Vodka', price: '4.50 €', desc: '2cl' },
      { name: 'Martini, Porto, Suze', price: '4.00 €' },
      { name: 'Whisky Supérieur', price: '8.00 €', desc: '4cl' },
      { name: 'Jack Daniel’s', price: '7.00 €', desc: '4cl' },
      { name: 'Mr ou Mme Gin Tonic', price: '8.00 €' },
      { name: '4cl de Din, 3 Agrumes, Thym et Tonic', price: '8.00 €' },
      { name: 'Panaché', price: '3.00 €' },
      { name: 'Monaco', price: '3.20 €' },
      { name: 'Demi sirop', price: '3.30 €' }
    ]
  },
  {
    category: 'Digestifs',
    items: [
      { name: 'Cognac, Armagnac, Calvados', price: '7.00 €' },
      { name: 'Cognac XO, Miso', price: '10.00 €' },
      { name: 'Diplomatico, Captain Black', price: '8.00 €', desc: '4cl' },
      { name: 'Bumbu, Bumbu Cream', price: '9.00 €' },
      { name: 'Bailys, Get 27, Get 21', price: '7.00 €' },
      { name: 'Rhum XO', price: '10.00 €' },
      { name: 'Kahlua, Cointreau, Grand Marnier', price: '8.00 €' },
      { name: 'Cognac, café et crème', price: '8.00 €' }
    ]
  },
  {
    category: 'Cocktails',
    items: [
      { name: 'Caïpirinha', price: '8.00 €', desc: '4cl cachaça, citron vert, sucre de canne' },
      { name: 'Caïpirinha Déclinaison', price: '9.00 €', desc: 'Fraise, fruit de la passion, mange' },
      { name: 'Piña Colada', price: '8.00 €', desc: '3cl rhum blanc, 3cl rhum ambré, 8cl jus d’ananas, jus de coco' },
      { name: 'Americano', price: '7.00 €', desc: '3cl Martini rouge, 3cl bitter rouge et eau pétillante' },
      { name: 'Spritz', price: '8.00 €', desc: '4cl bitter rouge, prosecco, et eau pétillante' },
      { name: 'Negroni', price: '9.00 €', desc: '3cl Martini rouge, 3cl bitter rouge et 3 cl gin' },
      { name: 'Vodkatini', price: '9.00 €', desc: '6cl Vodka, 1cl Martini blanc zeste de citron olive' },
      { name: 'Baptiste', price: '11.00 €', desc: '5cl Cognac, jus de citron, 1cl Cointreau et bière blonde' },
      { name: 'Whisky Sour', price: '9.00 €', desc: '4cl Whisky, jus de citron, blanc d’oeuf' },
      { name: 'Shoreline Fizz', price: '9.00 €', desc: '5cl cognac, 2,5cl sirop de fraise, 2cl jus de citron, 1cl blanc d’oeuf' },
      { name: 'French Mule', price: '9.00 €', desc: '4,5cl Cognac, 3cl jus de citron vert, 2cl de sucre, 3cl eau pétillante' },
      { name: 'Cuba Libre', price: '7.50 €', desc: '5cl Rhum blanc/ambré 12cl de coca-cola, citron vert' },
      { name: 'Bloody Mary', price: '9.00 €', desc: '5cl vodka, jus de tomate, sel de céleri, citron, Tabasco' },
      { name: 'Irish Coffe', price: '8.00 €', desc: 'Whisky, café et crème' },
      { name: 'French Coffe', price: '8.00 €', desc: 'Cognac, café et crème' }
    ]
  },
  {
    category: 'Bouteilles d’alcool',
    desc: 'Gamme Tessendier Francaise 70cl. Avec 1 mix au choix.',
    items: [
      { name: 'Vodka, Gin Whisky. Rhum Spiced', price: '60.00 €' },
      { name: 'Jack Daniel’s', price: '80.00 €' },
      { name: 'Ricard, Pastis', price: '70.00 €' },
      { name: 'Bacardi, Bacardi Oro, Grey Goose', price: '70.00 €' }
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
