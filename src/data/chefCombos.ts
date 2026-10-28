export interface ChefMenuItem {
  name: string;
  price: number;
  category: 'entrée' | 'plat' | 'vin' | 'dessert';
  desc?: string;
  badge?: string;
}

export interface ChefCombo {
  entree: ChefMenuItem;
  plat: ChefMenuItem;
  vin: ChefMenuItem;
  dessert: ChefMenuItem;
  totalPrice: number;
}

export const ENTREES: ChefMenuItem[] = [
  { name: 'Salade croquant Saint-Nectaire & poire', price: 8.0, category: 'entrée', desc: 'Poire fraîche et noix' },
  { name: 'Bouchée à la reine poulet & champignons', price: 8.0, category: 'entrée', desc: 'Feuilleté doré' },
  { name: 'Œuf poché, sauce marchand de vin', price: 7.0, category: 'entrée', desc: 'Croutons aillés' },
  { name: 'Terrine de chasse artisanale', price: 7.0, category: 'entrée', desc: 'Cornichons et pain de campagne' },
  { name: 'Soupe de poisson artisanale', price: 10.0, category: 'entrée', desc: 'Rouille maison et croûtons' },
];

export const PLATS: (ChefMenuItem & { wineName: string; wineAppellation: string; winePrice: number })[] = [
  {
    name: 'Magret de canard 300/350g',
    price: 23.9,
    category: 'plat',
    desc: 'Cuit rosé, frites fraîches maison',
    wineName: 'Cuvée Lou Loup',
    wineAppellation: 'AOP Pic Saint-Loup',
    winePrice: 6.5,
  },
  {
    name: 'Bourride de poisson & ses filets',
    price: 25.0,
    category: 'plat',
    desc: 'Gratiné de rouille maison',
    wineName: 'Domaine de Belle Mare',
    wineAppellation: 'AOP Picpoul de Pinet',
    winePrice: 5.5,
  },
  {
    name: 'Côte de porc aveyronnaise',
    price: 19.5,
    category: 'plat',
    desc: 'Sauce miel-moutarde, gratin dauphinois',
    wineName: 'Mas du Chêne Noir',
    wineAppellation: 'AOP Faugères',
    winePrice: 6.0,
  },
  {
    name: 'Joue de bœuf au cidre de pommes',
    price: 19.5,
    category: 'plat',
    desc: 'Fondante, gratin de pommes de terre',
    wineName: 'Les Combariolles',
    wineAppellation: 'AOP Terrasses du Larzac',
    winePrice: 7.0,
  },
  {
    name: 'Parmentier de canard, patate douce',
    price: 19.5,
    category: 'plat',
    desc: 'Gratiné au four, salade verte',
    wineName: 'Cuvée Tradition',
    wineAppellation: 'AOP Saint-Chinian',
    winePrice: 5.8,
  },
  {
    name: "Le BISTROT'S Burger au St-Nectaire",
    price: 21.0,
    category: 'plat',
    desc: 'Bœuf français, 2 tranches Saint-Nectaire',
    wineName: 'Cuvée Saint-Clément',
    wineAppellation: 'AOP Grés de Montpellier',
    winePrice: 6.0,
  },
  {
    name: 'Seiches grillées en persillade',
    price: 19.0,
    category: 'plat',
    desc: 'Aïoli maison & poivrons marinés',
    wineName: 'Terres Blanches',
    wineAppellation: 'IGP Pays d’Oc Blanc',
    winePrice: 5.5,
  },
];

export const DESSERTS: ChefMenuItem[] = [
  { name: 'Café Gourmand du Bistrot', price: 7.5, category: 'dessert', desc: 'Assortiment de 3 douceurs' },
  { name: 'Moelleux au chocolat cœur coulant', price: 7.0, category: 'dessert', desc: 'Crème anglaise vanillée' },
  { name: 'Tarte tatin tiède & crème fraîche', price: 7.5, category: 'dessert', desc: 'Pommes caramélisées' },
  { name: 'Crème brûlée à la vanille bourbon', price: 6.5, category: 'dessert', desc: 'Caramélisée minute' },
  { name: 'Tiramisu traditionnel', price: 7.0, category: 'dessert', desc: 'Recette maison' },
];

export function getRandomChefCombo(): ChefCombo {
  const entree = ENTREES[Math.floor(Math.random() * ENTREES.length)];
  const platData = PLATS[Math.floor(Math.random() * PLATS.length)];
  const dessert = DESSERTS[Math.floor(Math.random() * DESSERTS.length)];

  const vin: ChefMenuItem = {
    name: `${platData.wineName} (${platData.wineAppellation})`,
    price: platData.winePrice,
    category: 'vin',
    desc: 'Accord parfait avec le plat choisi',
  };

  const plat: ChefMenuItem = {
    name: platData.name,
    price: platData.price,
    category: 'plat',
    desc: platData.desc,
  };

  const totalPrice = entree.price + plat.price + vin.price + dessert.price;

  return {
    entree,
    plat,
    vin,
    dessert,
    totalPrice: Math.round(totalPrice * 10) / 10,
  };
}

