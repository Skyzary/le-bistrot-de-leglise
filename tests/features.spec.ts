import { test, expect } from '@playwright/test';

test.describe('Mobile Features: Live Status & Route Sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('should display harmonized location badge and live status badge in hero', async ({ page }) => {
    const locationTag = page.locator('span', { hasText: "Place de l'Église • Fabrègues" });
    await expect(locationTag).toBeVisible();

    const liveBadge = page.locator('span', { hasText: /(Service|Bar ouvert|Café|Fermé|Ouvert)/ }).first();
    await expect(liveBadge).toBeVisible();
  });

  test('should open and close RouteActionSheet when tapping Itinéraire on mobile', async ({ page }) => {
    const routeButton = page.locator('button', { hasText: 'Itinéraire' });
    await expect(routeButton).toBeVisible();

    await routeButton.click();

    // Check modal appears
    const sheetTitle = page.locator('h3', { hasText: 'Itinéraire & Contact' });
    await expect(sheetTitle).toBeVisible();

    // Check GPS and contact links
    await expect(page.locator('span', { hasText: 'Apple Plans' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Google Maps' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Waze' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Appeler le bistrot' })).toBeVisible();

    // Verify body attribute data-route-sheet-open is applied to hide chat
    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-route-sheet-open', 'true');

    // Close sheet
    const closeBtn = page.locator('button[aria-label="Fermer"]');
    await closeBtn.click();
    await expect(sheetTitle).toBeHidden();
    await expect(body).not.toHaveAttribute('data-route-sheet-open', 'true');
  });
});

test.describe('Mobile Features: La Roulette du Chef', () => {
  test('should open Roulette modal, spin, and transfer menu to reservation special requests', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const rouletteBtn = page.locator('button', { hasText: 'La Roulette du Chef' });
    await expect(rouletteBtn).toBeVisible();
    await rouletteBtn.click();

    // Check modal content
    const modalTitle = page.locator('h3', { hasText: 'La Roulette du Chef' });
    await expect(modalTitle).toBeVisible();

    // Check the 4 course slots are displayed
    await expect(page.locator('span', { hasText: 'Entrée' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Plat de Résistance' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Accord Vin (Verre)' })).toBeVisible();
    await expect(page.getByText('Dessert', { exact: true })).toBeVisible();

    // Click spin button
    const spinBtn = page.locator('button', { hasText: 'Faire tourner la roulette !' });
    await spinBtn.click();

    // Wait for spin to complete and click Book
    const bookBtn = page.locator('button', { hasText: 'Réserver pour déguster ce menu' });
    await expect(bookBtn).toBeVisible({ timeout: 5000 });
    await bookBtn.click();

    // Verify modal is closed
    await expect(modalTitle).toBeHidden();

    // Verify reservation textarea is populated with the selected combo
    const textarea = page.locator('textarea[name="requests"]');
    await expect(textarea).toBeVisible();
    const value = await textarea.inputValue();
    expect(value).toContain('Menu Roulette du Chef');
    expect(value).toContain('Entrée');
    expect(value).toContain('Plat');

    // Verify confirmation badge
    const badge = page.locator('text=Menu sélectionné automatiquement');
    await expect(badge).toBeVisible();
  });
});

test.describe('Mobile Features: Sommelier Wine Pairing', () => {
  test('should display sommelier wine pairings on menu page and open details sheet', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/menu');

    // Find a sommelier pairing badge
    const sommelierBtn = page.locator('button', { hasText: /Accord sommelier/ }).first();
    await expect(sommelierBtn).toBeVisible();
    await sommelierBtn.click();

    // Check sommelier modal is visible with appellation and quote
    const modalHeader = page.locator('span', { hasText: 'Accord du Sommelier' });
    await expect(modalHeader).toBeVisible();

    const quoteTitle = page.locator('span', { hasText: 'Pourquoi cet accord ?' });
    await expect(quoteTitle).toBeVisible();

    // Close sommelier sheet
    const closeBtn = page.locator('button[aria-label="Fermer la recommandation"]');
    await closeBtn.click();
    await expect(modalHeader).toBeHidden();
  });
});

test.describe('Mobile Features: Gallery Fullscreen Dish Stories', () => {
  test('tapping photo slide in gallery opens interactive story viewer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const firstSlide = page.locator('button[class*="slide"]').first();
    await expect(firstSlide).toBeVisible();
    await firstSlide.click();

    // Check Story viewer is displayed
    const authorHeader = page.locator('span', { hasText: "Le Bistrot de l'Église" }).first();
    await expect(authorHeader).toBeVisible();

    const bookTableBtn = page.locator('button', { hasText: 'Réserver pour goûter' });
    await expect(bookTableBtn).toBeVisible();

    // Close story
    const closeBtn = page.locator('button[aria-label="Fermer la vue"]');
    await closeBtn.click();
    await expect(bookTableBtn).toBeHidden();
  });
});

