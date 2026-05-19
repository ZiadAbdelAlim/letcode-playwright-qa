import { test, expect } from '@fixtures/pages.fixture';

test.describe('Sortable (/sortable)', () => {
  test.beforeEach(async ({ sortablePage }) => {
    await sortablePage.goto();
  });

  test('initial to-do list contains 4 items', async ({ sortablePage }) => {
    const todos = await sortablePage.getTodoTexts();
    expect(todos).toEqual(['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep']);
  });

  test('initial done list contains 5 items', async ({ sortablePage }) => {
    const done = await sortablePage.getDoneTexts();
    expect(done.length).toBe(5);
    expect(done).toContain('Walk dog');
  });

  test('moves a single item from to-do into done', async ({ sortablePage }) => {
    await sortablePage.moveItemFromTodoToDone('Get to work');
    expect(await sortablePage.getTodoTexts()).not.toContain('Get to work');
    expect(await sortablePage.getDoneTexts()).toContain('Get to work');
  });

  test('moves all remaining to-do items into done', async ({ sortablePage }) => {
    await sortablePage.moveAllTodosToDone();
    expect(await sortablePage.getTodoTexts()).toEqual([]);
    expect((await sortablePage.getDoneTexts()).length).toBeGreaterThanOrEqual(9);
  });
});
