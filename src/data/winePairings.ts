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
    wineName: 'Rouge - IGP OC Typiquement Carignan',
    appellation: 'IGP Pays d’Oc',
    wineType: 'Rouge',
    badge: 'Rouge du Terroir',
    priceGlass: '4.00 €',
    priceBottle: '14.00 €',
    cepages: 'Carignan 100%',
    tastingNotes: 'Robe rubis profond aux reflets violines. Arômes généreux de mûres sauvages, de cerises noires et d’épices de la garrigue. Bouche gourmande, ronde et fruitée.',
    sommelierQuote: 'La gourmandise fruitée et les tanins fondus de ce Carignan du terroir équilibrent admirablement la tendreté et le caractère du magret rosé.',
  },
  'cote-porc': {
    dishKey: 'cote-porc',
    dishName: 'Côte de porc aveyronnaise',
    wineName: 'Rouge - IGP OC Typiquement Carignan',
    appellation: 'IGP Pays d’Oc',
    wineType: 'Rouge',
    badge: 'Épicé & Gourmand',
    priceGlass: '4.00 €',
    priceBottle: '14.00 €',
    cepages: 'Carignan 100%',
    tastingNotes: 'Notes de fruits rouges mûrs, d’épices douces et d’herbes aromatiques. Finale fraîche et gouleyante.',
    sommelierQuote: 'La franchise et la rondeur du Carignan accompagnent parfaitement la sauce généreuse miel-moutarde et la viande aveyronnaise.',
  },
  'bourride': {
    dishKey: 'bourride',
    dishName: 'Bourride de poisson et ses filets',
    wineName: 'Blanc - IGP OC Chardonnay / Viognier',
    appellation: 'IGP Pays d’Oc',
    wineType: 'Blanc',
    badge: 'Fraîcheur & Équilibre',
    priceGlass: '4.00 €',
    priceBottle: '14.00 €',
    cepages: 'Chardonnay, Viognier',
    tastingNotes: 'Robe dorée et brillante. Nez expressif de pêche blanche, de fleurs d’acacia et de zeste de citron. Bouche ample, onctueuse et fraîche.',
    sommelierQuote: 'La rondeur soyeuse du Chardonnay et les arômes floraux du Viognier épousent l’onctuosité de la rouille maison et des poissons frais mijotés.',
  },
  'joue-boeuf': {
    dishKey: 'joue-boeuf',
    dishName: 'Joue de bœuf au cidre de pommes',
    wineName: 'Rouge - IGP OC Typiquement Carignan',
    appellation: 'IGP Pays d’Oc',
    wineType: 'Rouge',
    badge: 'Charnu & Fruité',
    priceGlass: '4.00 €',
    priceBottle: '14.00 €',
    cepages: 'Carignan 100%',
    tastingNotes: 'Bouquet de fruits noirs compotés, de poivre noir et de garrigue. Matière souple et fondante en bouche.',
    sommelierQuote: 'Les tanins soyeux et la rondeur du Carignan répondent délicieusement au fondant de la joue confite et à la douceur acidulée du cidre.',
  },
  'burger': {
    dishKey: 'burger',
    dishName: "Le BISTROT'S Burger (Saint-Nectaire)",
    wineName: 'Rouge - IGP OC Typiquement Carignan',
    appellation: 'IGP Pays d’Oc',
    wineType: 'Rouge',
    badge: 'Gourmand & Convivial',
    priceGlass: '4.00 €',
    priceBottle: '14.00 €',
    cepages: 'Carignan 100%',
    tastingNotes: 'Générosité de petits fruits rouges mûrs et touche épicée. Bouche chaleureuse et digeste.',
    sommelierQuote: 'Un rouge friand et équilibré qui met en valeur la puissance du bœuf grillé et le crémeux du Saint-Nectaire fermier.',
  },
  'seiches': {
    dishKey: 'seiches',
    dishName: 'Seiches grillées en persillade',
    wineName: 'Blanc - IGP OC Chardonnay / Viognier',
    appellation: 'IGP Pays d’Oc',
    wineType: 'Blanc',
    badge: 'Minéral & Grillades',
    priceGlass: '4.00 €',
    priceBottle: '14.00 €',
    cepages: 'Chardonnay, Viognier',
    tastingNotes: 'Notes de fruits à chair blanche, d’agrumes et d’abricot. Équilibre idéal entre gras noble et vivacité en fin de bouche.',
    sommelierQuote: 'La vivacité et les arômes frais de cet assemblage blanc tranchent avec l’aïoli maison et subliment la plancha de seiches dorées.',
  },
  'parmentier': {
    dishKey: 'parmentier',
    dishName: 'Parmentier de canard, patate douce',
    wineName: 'Rouge - IGP OC Typiquement Carignan',
    appellation: 'IGP Pays d’Oc',
    wineType: 'Rouge',
    badge: 'Rondeur & Caractère',
    priceGlass: '4.00 €',
    priceBottle: '14.00 €',
    cepages: 'Carignan 100%',
    tastingNotes: 'Parfums de garrigue, de pruneau et d’épices douces. Bouche harmonieuse et soyeuse.',
    sommelierQuote: 'Le bouquet d’épices douces et la rondeur du Carignan font un écho parfait à la douceur de la patate douce et à l’effiloché de canard.',
  },
  'salade': {
    dishKey: 'salade',
    dishName: 'Salade croquant Saint-Nectaire et poire',
    wineName: 'Rosé - IGP Côte de Thau Gemme',
    appellation: 'IGP Côtes de Thau',
    wineType: 'Rosé',
    badge: 'Croquant & Floral',
    priceGlass: '3.50 €',
    priceBottle: '14.00 €',
    cepages: 'Grenache, Cinsault',
    tastingNotes: 'Robe pétale de rose très pâle. Nez délicat de framboise, groseille et agrumes. Bouche vivifiante et désaltérante.',
    sommelierQuote: 'La fraîcheur croquante et les arômes de fruits frais de la cuvée Gemme apportent un accord vivifiant avec la poire et le Saint-Nectaire.',
  },
};

/**
 * Finds a matching wine pairing for a dish name (fuzzy or exact).
 */
export function getWinePairingForDish(name: string): WinePairing | null {
  const normalized = name.toLowerCase();
  if (normalized.includes('magret')) return WINE_PAIRINGS['magret'];
  if (normalized.includes('porc') || normalized.includes('aveyron')) return WINE_PAIRINGS['cote-porc'];
  if (normalized.includes('bourride') || normalized.includes('poisson')) return WINE_PAIRINGS['bourride'];
  if (normalized.includes('joue') || normalized.includes('bœuf') || normalized.includes('boeuf')) return WINE_PAIRINGS['joue-boeuf'];
  if (normalized.includes('bistrot\'s burger') || normalized.includes('st nectaire') || normalized.includes('saint-nectaire') || normalized.includes('burger')) return WINE_PAIRINGS['burger'];
  if (normalized.includes('seiche')) return WINE_PAIRINGS['seiches'];
  if (normalized.includes('parmentier')) return WINE_PAIRINGS['parmentier'];
  if (normalized.includes('salade croquant') || normalized.includes('croquant')) return WINE_PAIRINGS['salade'];
  return null;
}
