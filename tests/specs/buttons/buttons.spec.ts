import { test, expect } from '@fixtures/pages.fixture';

test.describe('Buttons (/buttons)', () => {
  test.beforeEach(async ({ buttonsPage }) => {
    await buttonsPage.goto();
  });

  test.describe('Navigation', () => {
    test('Goto Home button navigates to /', async ({ buttonsPage, page }) => {
      await buttonsPage.clickGoHome();
      await expect(page).toHaveURL(/letcode\.in\/?$/);
    });

    test('back navigation returns to the buttons page', async ({ buttonsPage, page }) => {
      await buttonsPage.clickGoHome();
      await page.goBack();
      await expect(page).toHaveURL(/\/button(s)?$/);
      await expect(buttonsPage.locationButton, 'Page should be re-rendered').toBeVisible();
    });
  });

  test.describe('Geometric & CSS introspection', () => {
    test('Find Location returns positive x/y coordinates', async ({ buttonsPage }) => {
      const box = await buttonsPage.getButtonBox(buttonsPage.locationButton);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
    });

    test('color of the primary button is a non-empty rgb()', async ({ buttonsPage }) => {
      const color = await buttonsPage.getButtonColor(buttonsPage.colorButton);
      expect(color, 'Computed background should be a non-empty rgb()').toMatch(/^rgba?\(.+\)$/);
    });

    test('size button reports non-zero width and height', async ({ buttonsPage }) => {
      const box = await buttonsPage.getButtonBox(buttonsPage.sizeButton);
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    });
  });

  test.describe('Disabled state', () => {
    test('disabled button reports disabled=true and a real click is rejected by the engine', async ({
      buttonsPage,
    }) => {
      await expect(buttonsPage.disabledButton).toBeDisabled();
      await expect(
        buttonsPage.disabledButton.click({ timeout: 1_500 }),
        'A disabled element should not accept a normal .click()',
      ).rejects.toThrow();
      await expect(buttonsPage.disabledButton).toBeDisabled();
    });

    test('forcing a click on a disabled button does not navigate away', async ({ buttonsPage, page }) => {
      const urlBefore = page.url();
      await buttonsPage.disabledButton.click({ force: true }).catch(() => undefined);
      expect(page.url(), 'Force-click must not trigger navigation').toBe(urlBefore);
    });
  });

  test.describe('Mouse interactions', () => {
    test('click and hold for >500ms leaves no error in console', async ({ buttonsPage, page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await buttonsPage.holdAndRelease(600);
      expect(errors, 'Hold/release must not throw page errors').toEqual([]);
    });

    test('rapid double-clicks do not detach the button', async ({ buttonsPage }) => {
      await buttonsPage.locationButton.dblclick();
      await expect(buttonsPage.locationButton, 'Element must remain attached').toBeVisible();
    });
  });
});
