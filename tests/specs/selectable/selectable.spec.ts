import { test, expect } from '@fixtures/pages.fixture';

test.describe('Selectable / Multi-select (/selectable)', () => {
  test.beforeEach(async ({ selectablePage }) => {
    await selectablePage.goto();
  });

  test('lists the expected automation tools', async ({ selectablePage }) => {
    const items = await selectablePage.listItemNames();
    for (const tool of ['Playwright', 'Selenium', 'Cypress', 'Webdriver.io']) {
      expect(items, `Expected list to contain ${tool}`).toContain(tool);
    }
  });

  test('clicking an item triggers an event (no console error)', async ({ selectablePage, page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await selectablePage.itemByName('Playwright').click();
    expect(errors, 'Clicking must not raise page errors').toEqual([]);
  });

  test('iterating over every item does not crash', async ({ selectablePage, page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await selectablePage.clickAll();
    expect(errors).toEqual([]);
  });
});
