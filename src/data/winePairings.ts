export interface WinePairing {
  dishKey: string;
  dishName: string;
  wineName: string;
  appellation: string;
  wineType: 'Rouge' | 'Blanc' | 'Rosé';
  badge: string;
  priceGlass: string;
  priceBottle: string;
  cepages: string;
  tastingNotes: string;
  sommelierQuote: string;
}

export const WINE_PAIRINGS: Record<string, WinePairing> = {
  'magret': {
    dishKey: 'magret',
    dishName: 'Magret de canard 300/350g',
    wineName: 'Cuvée Lou Loup',
    appellation: 'AOP Pic Saint-Loup',
    wineType: 'Rouge',
    badge: 'Rouge de Caractère',
    priceGlass: '6.50 €',
    priceBottle: '29.00 €',
    cepages: 'Syrah 65%, Grenache 25%, Mourvèdre 10%',
    tastingNotes: 'Robe grenat intense. Notes gourmandes de mûre sauvage, d’épices de la garrigue et de poivre noir. Finale longue et soyeuse.',
    sommelierQuote: 'La puissance et les tanins fondus de ce Pic Saint-Loup équilibrent parfaitement la richesse et la texture tendre du magret rosé.',
  },
  'cote-porc': {
    dishKey: 'cote-porc',
    dishName: 'Côte de porc aveyronnaise',
    wineName: 'Mas du Chêne Noir',
    appellation: 'AOP Faugères',
    wineType: 'Rouge',
    badge: 'Terroir de Schiste',
    priceGlass: '6.00 €',
    priceBottle: '27.00 €',
    cepages: 'Carignan 40%, Syrah 35%, Grenache 25%',
    tastingNotes: 'Élégant et charpenté. Arômes de cerise noire, de réglisse et de garrigue avec une trame minérale fraîche typique du schiste.',
    sommelierQuote: 'La fraîcheur du schiste et la gourmandise du fruit viennent trancher la douceur de la sauce miel-moutarde.',
  },
  'bourride': {
    dishKey: 'bourride',
    dishName: 'Bourride de poisson et ses filets',
    wineName: 'Domaine de Belle Mare',
    appellation: 'AOP Picpoul de Pinet',
    wineType: 'Blanc',
    badge: 'Fraîcheur & Salinité',
    priceGlass: '5.50 €',
    priceBottle: '24.00 €',
    cepages: 'Piquepoul Blanc 100%',
    tastingNotes: 'Robe jaune pâle aux reflets verts. Nez vivifiant d’agrumes mûrs, de fleurs blanches et d’iode. Bouche tendue et saline.',
    sommelierQuote: 'L’acidité vive et la salinité du Picpoul apportent un contraste saisissant avec l’onctuosité de la rouille maison et des poissons mijotés.',
  },
  'joue-boeuf': {
    dishKey: 'joue-boeuf',
    dishName: 'Joue de bœuf au cidre de pommes',
    wineName: 'Les Combariolles',
    appellation: 'AOP Terrasses du Larzac',
    wineType: 'Rouge',
    badge: 'Grand Rouge Méditerranéen',
    priceGlass: '7.00 €',
    priceBottle: '32.00 €',
    cepages: 'Syrah 50%, Grenache 30%, Carignan 20%',
    tastingNotes: 'Bouquet complexe de fruits noirs macérés, de cacao torréfié et de laurier. Texture fondante et tanins d’une grande noblesse.',
    sommelierQuote: 'Un vin structuré et frais à la fois qui sublime le fondant et la douceur subtile du cidre de pomme.',
  },
  'burger': {
    dishKey: 'burger',
    dishName: "Le BISTROT'S Burger (Saint-Nectaire)",
    wineName: 'Cuvée Saint-Clément',
    appellation: 'AOP Grés de Montpellier',
    wineType: 'Rouge',
    badge: 'Charnu & Fruité',
    priceGlass: '6.00 €',
    priceBottle: '26.00 €',
    cepages: 'Grenache 60%, Syrah 40%',
    tastingNotes: 'Générosité de fruits rouges confiturés, touche vanillée et belle rondeur en bouche.',
    sommelierQuote: 'La rondeur du Grenache enveloppe à merveille le fondant du Saint-Nectaire affiné et la viande charolaise grillée.',
  },
  'seiches': {
    dishKey: 'seiches',
    dishName: 'Seiches grillées en persillade',
    wineName: 'Cuvée Terres Blanches',
    appellation: 'IGP Pays d’Oc Blanc',
    wineType: 'Blanc',
    badge: 'Minéral & Grillades',
    priceGlass: '5.50 €',
    priceBottle: '23.00 €',
    cepages: 'Chardonnay 70%, Viognier 30%',
    tastingNotes: 'Notes de pêche de vigne, d’amande fraîche et de zeste de citron. Texture soyeuse avec une finale nette et droite.',
    sommelierQuote: 'Le gras noble du Chardonnay et la vivacité de la finale s’accordent divinement avec l’aïoli et la caramélisation de la plancha.',
  },
  'parmentier': {
    dishKey: 'parmentier',
    dishName: 'Parmentier de canard, patate douce',
    wineName: 'Cuvée Tradition',
    appellation: 'AOP Saint-Chinian',
    wineType: 'Rouge',
    badge: 'Épicé & Gourmand',
    priceGlass: '5.80 €',
    priceBottle: '25.00 €',
    cepages: 'Syrah 50%, Mourvèdre 30%, Grenache 20%',
    tastingNotes: 'Parfums de garrigue, de pruneau et de poivre blanc. Bouche ronde et chaleureuse.',
    sommelierQuote: 'Les notes épicées et chaudes de Saint-Chinian répondent à merveille à la douceur sucrée de la patate douce.',
  },
};

/**
 * Finds a matching wine pairing for a dish name (fuzzy or exact).
 */
export function getWinePairingForDish(name: string): WinePairing | null {
  const normalized = name.toLowerCase();
  if (normalized.includes('magret')) return WINE_PAIRINGS['magret'];
  if (normalized.includes('porc') || normalized.includes('aveyron')) return WINE_PAIRINGS['cote-porc'];
  if (normalized.includes('bourride')) return WINE_PAIRINGS['bourride'];
  if (normalized.includes('joue') || normalized.includes('bœuf') || normalized.includes('boeuf')) return WINE_PAIRINGS['joue-boeuf'];
  if (normalized.includes('bistrot\'s burger') || normalized.includes('st nectaire') || normalized.includes('saint-nectaire')) return WINE_PAIRINGS['burger'];
  if (normalized.includes('seiche')) return WINE_PAIRINGS['seiches'];
  if (normalized.includes('parmentier')) return WINE_PAIRINGS['parmentier'];
  return null;
}

