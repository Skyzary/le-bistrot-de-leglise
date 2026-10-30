import { test, expect } from '@playwright/test';
import { getWinePairingForDish, WINE_PAIRINGS } from '../src/data/winePairings';
import { getRandomChefCombo, ENTREES, PLATS, DESSERTS } from '../src/data/chefCombos';
import { getGoogleCalendarUrl, CalendarEvent } from '../src/utils/calendar';
import { triggerHaptic } from '../src/utils/haptics';
import { eventsData } from '../src/config/data';

test.describe('Unit Tests: Sommelier & Wine Pairings', () => {
  test('should return correct wine pairing for Magret de canard', () => {
    const pairing = getWinePairingForDish('Magret de canard 300/350g');
    expect(pairing).not.toBeNull();
    expect(pairing?.wineName).toBe('Rouge - IGP OC Typiquement Carignan');
    expect(pairing?.appellation).toBe('IGP Pays d’Oc');
    expect(pairing?.wineType).toBe('Rouge');
    expect(pairing?.priceGlass).toBe('4.00 €');
  });

  test('should return correct wine pairing for Bourride de poisson', () => {
    const pairing = getWinePairingForDish('Bourride de poisson et ses filets');
    expect(pairing).not.toBeNull();
    expect(pairing?.wineName).toBe('Blanc - IGP OC Chardonnay / Viognier');
    expect(pairing?.appellation).toBe('IGP Pays d’Oc');
    expect(pairing?.wineType).toBe('Blanc');
  });

  test('should return correct wine pairing for Burger with Saint-Nectaire', () => {
    const pairing = getWinePairingForDish("Le BISTROT'S Burger (Saint-Nectaire)");
    expect(pairing).not.toBeNull();
    expect(pairing?.wineName).toBe('Rouge - IGP OC Typiquement Carignan');
    expect(pairing?.appellation).toBe('IGP Pays d’Oc');
  });

  test('should return null for dish without dedicated pairing', () => {
    const pairing = getWinePairingForDish('Café expresso');
    expect(pairing).toBeNull();
  });

  test('all pairings in catalog should have complete data', () => {
    for (const key of Object.keys(WINE_PAIRINGS)) {
      const item = WINE_PAIRINGS[key];
      expect(item.dishName).toBeTruthy();
      expect(item.wineName).toBeTruthy();
      expect(item.appellation).toBeTruthy();
      expect(item.sommelierQuote.length).toBeGreaterThan(10);
      expect(item.cepages).toBeTruthy();
    }
  });
});

test.describe('Unit Tests: Chef Roulette Combos', () => {
  test('should have populated catalogs for entrees, plats, and desserts', () => {
    expect(ENTREES.length).toBeGreaterThanOrEqual(4);
    expect(PLATS.length).toBeGreaterThanOrEqual(5);
    expect(DESSERTS.length).toBeGreaterThanOrEqual(4);
  });

  test('getRandomChefCombo returns complete 4-step gourmet formula with accurate pricing', () => {
    const combo = getRandomChefCombo();
    expect(combo.entree).toBeDefined();
    expect(combo.plat).toBeDefined();
    expect(combo.vin).toBeDefined();
    expect(combo.dessert).toBeDefined();

    const expectedTotal =
      Math.round((combo.entree.price + combo.plat.price + combo.vin.price + combo.dessert.price) * 10) / 10;
    expect(combo.totalPrice).toBe(expectedTotal);
    expect(combo.totalPrice).toBeGreaterThan(30);
  });
});

test.describe('Unit Tests: Calendar & Event Generation', () => {
  const sampleEvent: CalendarEvent = {
    title: 'Table au Bistrot de l\'Église (4 pers.)',
    description: 'Réservation confirmée pour 4 personnes.',
    location: "Le Bistrot de l'Église, 4 place du 11 novembre 1918, 34690 Fabrègues",
    date: '2026-11-15',
    time: '20:00',
    durationHours: 2,
  };

  test('getGoogleCalendarUrl generates valid encoded URL with dates and location', () => {
    const url = getGoogleCalendarUrl(sampleEvent);
    expect(url).toContain('calendar.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain('text=Table+au+Bistrot+de+l%27%C3%89glise');
    expect(url).toContain('34690+Fabr%C3%A8gues');
  });
});

test.describe('Unit Tests: Haptics Engine', () => {
  test('triggerHaptic runs safely without crashing in server or unsupported environments', () => {
    expect(() => triggerHaptic('light')).not.toThrow();
    expect(() => triggerHaptic('medium')).not.toThrow();
    expect(() => triggerHaptic('heavy')).not.toThrow();
    expect(() => triggerHaptic('success')).not.toThrow();
    expect(() => triggerHaptic('selection')).not.toThrow();
  });
});

test.describe('Unit Tests: Bistro Events Data (Decap CMS)', () => {
  test('eventsData should contain valid upcoming event items with title, date, time, description, and image', () => {
    expect(Array.isArray(eventsData)).toBe(true);
    expect(eventsData.length).toBeGreaterThan(0);
    for (const ev of eventsData) {
      expect(ev.title).toBeTruthy();
      expect(ev.date).toBeTruthy();
      expect(ev.time).toBeTruthy();
      expect(ev.description).toBeTruthy();
      expect(ev.image).toBeTruthy();
    }
  });
});

