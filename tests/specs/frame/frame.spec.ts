import { test, expect } from '@fixtures/pages.fixture';

test.describe('Frames (/frame)', () => {
  test.beforeEach(async ({ framePage }) => {
    await framePage.goto();
  });

  test('outer iframe is attached and named "firstFr"', async ({ framePage, page }) => {
    const outer = page.locator('iframe#firstFr');
    await expect(outer).toBeAttached();
    await expect(outer).toHaveAttribute('name', 'firstFr');
  });

  test('fills first and last name inside outer frame', async ({ framePage }) => {
    await framePage.fillOuterDetails('Koushik', 'Chatterjee');
    await expect(framePage.outerFirstName).toHaveValue('Koushik');
    await expect(framePage.outerLastName).toHaveValue('Chatterjee');
  });

  test('inner frame email input accepts value', async ({ framePage }) => {
    await framePage.fillInnerEmail('qa@example.com');
    await expect(framePage.innerEmail).toHaveValue('qa@example.com');
  });

  test('parent document does not contain the inner inputs', async ({ framePage, page }) => {
    expect(await page.locator('input[name="fname"]').count()).toBe(0);
    expect(await page.locator('input[name="email"]').count()).toBe(0);
  });

  test('inner frame elements are not accessible without entering frames', async ({ page, framePage }) => {
    await framePage.goto();
    await expect(page.locator('input[name="email"]')).toHaveCount(0);
    await expect(framePage.innerEmail).toBeVisible();
  });
});
