import { test, expect } from '@fixtures/pages.fixture';

test.describe('Windows / Tabs (/window)', () => {
  test.beforeEach(async ({ windowPage }) => {
    await windowPage.goto();
  });

  test('opens home in a new tab and reads its title', async ({ windowPage, context }) => {
    const newPage = await windowPage.openHomeInNewTab(context);
    await expect(newPage).toHaveURL(/letcode\.in/);
    const title = await newPage.title();
    expect(title.length, 'New tab must have a non-empty title').toBeGreaterThan(0);
    await newPage.close();
  });

  test('parent window remains alive after closing child', async ({ windowPage, context }) => {
    const child = await windowPage.openHomeInNewTab(context);
    await child.close();
    await expect(windowPage.openHomeButton, 'Parent must still be reachable').toBeVisible();
  });

  test('opening multiple windows yields >= 1 extra tabs', async ({ windowPage, context }) => {
    const extras = await windowPage.openMultiple(context, 1);
    expect(extras.length, 'Multiple-windows button should open at least 1 tab').toBeGreaterThanOrEqual(1);
    for (const extra of extras) {
      await extra.close().catch(() => undefined);
    }
  });

  test('lists titles of all open windows', async ({ windowPage, context }) => {
    const child = await windowPage.openHomeInNewTab(context);
    const titles = await Promise.all(context.pages().map((p) => p.title()));
    expect(titles.length).toBeGreaterThanOrEqual(2);
    expect(titles.every((t) => typeof t === 'string'), 'All titles must be strings').toBe(true);
    await child.close();
  });
});
