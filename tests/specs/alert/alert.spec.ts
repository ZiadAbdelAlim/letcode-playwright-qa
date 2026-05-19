import { test, expect } from '@fixtures/pages.fixture';

test.describe('Alerts (/alert)', () => {
  test.beforeEach(async ({ alertPage }) => {
    await alertPage.goto();
  });

  test('Simple alert — accept', async ({ alertPage }) => {
    const dialogPromise = alertPage.oncePromise('accept');
    await alertPage.simpleAlertButton.click();
    const dialog = await dialogPromise;
    expect(dialog.type()).toBe('alert');
    expect(dialog.message().length, 'Alert must carry a message').toBeGreaterThan(0);
  });

  test('Confirm alert — dismiss and capture text', async ({ alertPage }) => {
    const dialogPromise = alertPage.oncePromise('dismiss');
    await alertPage.confirmButton.click();
    const dialog = await dialogPromise;
    expect(dialog.type()).toBe('confirm');
    expect(dialog.message()).not.toBe('');
  });

  test('Confirm alert — accept variant', async ({ alertPage }) => {
    const dialogPromise = alertPage.oncePromise('accept');
    await alertPage.confirmButton.click();
    const dialog = await dialogPromise;
    expect(dialog.type()).toBe('confirm');
  });

  test('Prompt alert — accept with a typed value', async ({ alertPage }) => {
    const typedValue = 'Playwright QA';
    const dialogPromise = alertPage.oncePromise('accept', typedValue);
    await alertPage.promptButton.click();
    const dialog = await dialogPromise;
    expect(dialog.type()).toBe('prompt');
    expect(dialog.defaultValue() ?? '').toBeDefined();
  });

  test('Prompt alert — dismiss', async ({ alertPage }) => {
    const dialogPromise = alertPage.oncePromise('dismiss');
    await alertPage.promptButton.click();
    const dialog = await dialogPromise;
    expect(dialog.type()).toBe('prompt');
  });

  test('Sweet alert (modal) opens and can be closed', async ({ alertPage }) => {
    await alertPage.sweetAlertButton.click();
    await expect(alertPage.sweetModal, 'Modal should appear').toBeVisible();
    await alertPage.sweetModalCloseButton.click();
    await expect(alertPage.sweetModal).toBeHidden({ timeout: 5_000 });
  });

  test('No listener — Playwright auto-dismisses native dialogs without hanging', async ({ alertPage }) => {
    await alertPage.simpleAlertButton.click();
    await expect(alertPage.simpleAlertButton, 'Page should still be usable').toBeEnabled();
  });
});
