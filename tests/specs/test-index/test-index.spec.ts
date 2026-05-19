import { test, expect } from '@fixtures/pages.fixture';

const EXPECTED_CARDS = [
  'POM', 'Input', 'Button', 'Select', 'Alert', 'Frame', 'Radio', 'Window',
  'Elements', 'Drag', 'Drop', 'Sort', 'Multi-Select', 'Slider', 'Waits',
  'Table', 'Calendar', 'Forms', 'File', 'Shadow',
] as const;

const EXPECTED_TABLE_DUPLICATES = 2;

test.describe('Test Index page — landing for all 21 examples', () => {
  test.beforeEach(async ({ testIndexPage }) => {
    await testIndexPage.goto();
  });

  test('renders the landing headline', async ({ testIndexPage }) => {
    await expect(testIndexPage.pageTitle, 'Landing headline should be visible').toBeVisible();
  });

  test('exposes 21 practice example cards', async ({ testIndexPage }) => {
    await expect(testIndexPage.menuCards, 'LetCode advertises exactly 21 examples').toHaveCount(21);
  });

  test('each card has a non-empty navigation link', async ({ testIndexPage }) => {
    const links = testIndexPage.menuCards.getByRole('link');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href, `Card #${i + 1} should have a non-root href`).toBeTruthy();
      expect(href).not.toBe('/');
    }
  });

  for (const cardTitle of EXPECTED_CARDS) {
    test(`landing page lists the "${cardTitle}" card`, async ({ testIndexPage }) => {
      const expectedCount = cardTitle === 'Table' ? EXPECTED_TABLE_DUPLICATES : 1;
      await expect(
        testIndexPage.cardByTitle(cardTitle),
        `Expected "${cardTitle}" card to appear ${expectedCount} time(s)`,
      ).toHaveCount(expectedCount);
    });
  }

  test('card titles snapshot matches expected layout', async ({ testIndexPage }) => {
    const titles = await testIndexPage.listCardTitles();
    expect(titles, 'Total card count should be 21 (with two "Table" cards)').toHaveLength(21);
    expect(titles.filter((t) => t === 'Table'), 'Two cards share the "Table" title').toHaveLength(2);
  });

  test('clicking Input card navigates to /edit', async ({ testIndexPage, page }) => {
    await testIndexPage.clickCard('Input');
    await expect(page).toHaveURL(/\/edit$/);
  });

  test('clicking POM card navigates to /home', async ({ testIndexPage, page }) => {
    await testIndexPage.clickCard('POM');
    await expect(page).toHaveURL(/\/home$/);
  });
});
