import { test, expect } from '@fixtures/pages.fixture';

test.describe('Drag & Drop — Droppable (/droppable)', () => {
  test.beforeEach(async ({ droppablePage }) => {
    await droppablePage.goto();
  });

  test('source and target are visible with correct labels', async ({ droppablePage }) => {
    await expect(droppablePage.source).toBeVisible();
    await expect(droppablePage.source).toContainText(/Drag me to my target/i);
    await expect(droppablePage.target).toBeVisible();
  });

  test('manual mouse-based drag transfers the source into the target zone', async ({ droppablePage, page }) => {
    const sourceParentBefore = page.locator('#cdk-drop-list-0 #draggable');
    await expect(sourceParentBefore).toHaveCount(1);

    await droppablePage.manualDragToTarget();

    const sourceParentAfter = await sourceParentBefore.count();
    const inTarget = await droppablePage.targetContainsSource();
    const visuallyOver = await droppablePage.sourceCenterIsInsideTarget();

    expect(
      sourceParentAfter === 0 || inTarget || visuallyOver,
      'Source must transfer to target, appear inside it, or visually overlap it',
    ).toBe(true);
  });
});
