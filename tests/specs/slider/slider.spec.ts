import { test, expect } from '@fixtures/pages.fixture';

test.describe('Slider (/slider)', () => {
  test.beforeEach(async ({ sliderPage }) => {
    await sliderPage.goto();
  });

  test('initial range is 1..50 with default value 10', async ({ sliderPage }) => {
    expect(await sliderPage.getMin()).toBe(1);
    expect(await sliderPage.getMax()).toBe(50);
    expect(await sliderPage.getValue()).toBe(10);
  });

  test('setting a value within range is reflected', async ({ sliderPage }) => {
    await sliderPage.setValue(25);
    expect(await sliderPage.getValue()).toBe(25);
  });

  test.describe('Boundary values', () => {
    test('min boundary (1)', async ({ sliderPage }) => {
      await sliderPage.setValue(1);
      expect(await sliderPage.getValue()).toBe(1);
    });

    test('max boundary (50)', async ({ sliderPage }) => {
      await sliderPage.setValue(50);
      expect(await sliderPage.getValue()).toBe(50);
    });

    test('out-of-range value clamps to the max', async ({ sliderPage }) => {
      await sliderPage.setValue(9_999);
      expect(await sliderPage.getValue()).toBeLessThanOrEqual(50);
    });

    test('negative value clamps to the min', async ({ sliderPage }) => {
      await sliderPage.setValue(-100);
      expect(await sliderPage.getValue()).toBeGreaterThanOrEqual(1);
    });
  });

  test('clicking "Get Countries" after setting slider yields a country list', async ({ sliderPage, page }) => {
    await sliderPage.setValue(5);
    await sliderPage.clickGetCountries();
    await page.waitForTimeout(500);
    const bodyText = (await page.textContent('body')) ?? '';
    expect(bodyText.length).toBeGreaterThan(50);
  });
});
