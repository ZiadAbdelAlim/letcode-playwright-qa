import { test, expect } from '@fixtures/pages.fixture';

test.describe('Drag & Drop — Draggable (/draggable)', () => {
  test.beforeEach(async ({ draggablePage }) => {
    await draggablePage.goto();
  });

  test('boundary and draggable element are visible', async ({ draggablePage }) => {
    await expect(draggablePage.boundary).toBeVisible();
    await expect(draggablePage.draggable).toBeVisible();
  });

  test('drag moves the element inside the boundary', async ({ draggablePage }) => {
    const before = await draggablePage.getDraggablePosition();
    await draggablePage.dragBy(50, 30);
    const after = await draggablePage.getDraggablePosition();
    expect(after.x).not.toBe(before.x);
    expect(after.y).not.toBe(before.y);
  });

  test('cannot escape the dotted boundary', async ({ draggablePage }) => {
    const boundaryBox = await draggablePage.boundary.boundingBox();
    expect(boundaryBox, 'Boundary must be visible').not.toBeNull();
    await draggablePage.dragBy(5_000, 5_000);
    const dragBox = await draggablePage.draggable.boundingBox();
    expect(dragBox).not.toBeNull();
    expect(dragBox!.x).toBeLessThanOrEqual(boundaryBox!.x + boundaryBox!.width);
    expect(dragBox!.y).toBeLessThanOrEqual(boundaryBox!.y + boundaryBox!.height);
  });

  test('zero-offset drag keeps position stable', async ({ draggablePage }) => {
    const before = await draggablePage.getDraggablePosition();
    await draggablePage.dragBy(0, 0);
    const after = await draggablePage.getDraggablePosition();
    expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(2);
    expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(2);
  });
});
