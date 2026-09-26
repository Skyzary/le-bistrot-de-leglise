import { test, expect } from '@playwright/test';

test.describe('Responsive Landing Page', () => {
  test('should display sticky quick-action bar on mobile', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const actionBar = page.locator('div[class*="QuickActionMenu_wrapper"]');
    await expect(actionBar).toBeVisible();
  });

  test('should hide sticky quick-action bar on desktop', async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const actionBar = page.locator('div[class*="QuickActionMenu_wrapper"]');
    await expect(actionBar).toBeHidden();
  });
  
  test('should display hero section and correct title', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1', { hasText: 'Le XV' });
    await expect(heading).toBeVisible();
  });
});
