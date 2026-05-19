import { test, expect } from '@fixtures/pages.fixture';

test.describe('Waits (/waits)', () => {
  test.beforeEach(async ({ waitsPage }) => {
    await waitsPage.goto();
  });

  test('alert eventually appears and is accepted', async ({ waitsPage }) => {
    const message = await waitsPage.clickAndAcceptDelayedAlert(15_000);
    expect(message.length, 'Delayed alert should carry a message').toBeGreaterThan(0);
  });

  test('Accept button remains visible while waiting', async ({ waitsPage }) => {
    await expect(waitsPage.acceptButton).toBeVisible();
  });

  test('alert appears within an upper time bound (timing assertion)', async ({ waitsPage }) => {
    const started = Date.now();
    await waitsPage.clickAndAcceptDelayedAlert(15_000);
    const elapsed = Date.now() - started;
    expect(elapsed, 'Alert should not take more than 15s').toBeLessThan(15_000);
  });
});
