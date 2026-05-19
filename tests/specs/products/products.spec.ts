import { test, expect } from '@fixtures/pages.fixture';

test.describe('POM practice — Fake Store (/home)', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
  });

  test('renders Fake Store heading and Products section', async ({ productsPage }) => {
    await expect(productsPage.pageHeading).toBeVisible();
    await expect(productsPage.productsHeading).toBeVisible();
  });

  test('lists at least one product card', async ({ productsPage }) => {
    expect(await productsPage.getProductCount()).toBeGreaterThan(0);
  });

  test('every product card has a non-empty title and a price greater than 0', async ({ productsPage }) => {
    const titles = await productsPage.getTitles();
    const prices = await productsPage.getPrices();
    expect(titles.length).toBe(prices.length);
    for (let i = 0; i < titles.length; i++) {
      expect(titles[i], 'Product title must be non-empty').not.toBe('');
      expect(prices[i], `Product price for "${titles[i]}" must be > 0`).toBeGreaterThan(0);
    }
  });

  test('cart and user navigation buttons are visible', async ({ productsPage }) => {
    await expect(productsPage.cartButton).toBeVisible();
    await expect(productsPage.userButton).toBeVisible();
  });

  test('a specific known product appears in the catalog', async ({ productsPage }) => {
    expect(await productsPage.cardByTitle('Foldsack').count()).toBeGreaterThan(0);
  });
});
