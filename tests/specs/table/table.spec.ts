import { test, expect } from '@fixtures/pages.fixture';

test.describe('Simple Table (/table)', () => {
  test.beforeEach(async ({ tablePage }) => {
    await tablePage.goto();
  });

  test.describe('Shopping list', () => {
    test('lists 4 items', async ({ tablePage }) => {
      await expect(tablePage.shoppingRows).toHaveCount(4);
    });

    test('sum of prices equals displayed total', async ({ tablePage }) => {
      const prices = await tablePage.getShoppingPrices();
      const sum = prices.reduce((a, b) => a + b, 0);
      const total = await tablePage.getDisplayedShoppingTotal();
      expect(sum, 'Sum of price column should match the footer total').toBe(total);
    });

    test('detects mismatch if a price is altered (sanity check)', async ({ tablePage }) => {
      const prices = await tablePage.getShoppingPrices();
      const tampered = [...prices.slice(0, -1), prices.at(-1)! + 1].reduce((a, b) => a + b, 0);
      const total = await tablePage.getDisplayedShoppingTotal();
      expect(tampered, 'Tampered sum must not match the displayed total').not.toBe(total);
    });
  });

  test.describe('Attendance table', () => {
    test('marks Raj as present and leaves others unchanged', async ({ tablePage }) => {
      const before = {
        koushik: await tablePage.isAttendanceChecked('Koushik'),
        raj: await tablePage.isAttendanceChecked('Yashwanth'),
        iron: await tablePage.isAttendanceChecked('Iron'),
      };
      expect(before.raj).toBe(false);

      await tablePage.markAttendanceFor('Yashwanth');

      expect(await tablePage.isAttendanceChecked('Yashwanth')).toBe(true);
      expect(await tablePage.isAttendanceChecked('Koushik')).toBe(before.koushik);
      expect(await tablePage.isAttendanceChecked('Iron')).toBe(before.iron);
    });

    test('non-existent row does not match any attendance row', async ({ tablePage }) => {
      await expect(tablePage.attendanceRowByName('Thanos')).toHaveCount(0);
    });
  });

  test.describe('Sortable table', () => {
    test('clicking the Calories header sorts the column', async ({ tablePage }) => {
      await tablePage.clickSortableHeader('calories');
      const sortedAsc = await tablePage.getSortableColumnValues(1);
      const asNumbers = sortedAsc.map(Number).filter((n) => Number.isFinite(n));
      const expected = [...asNumbers].sort((a, b) => a - b);
      expect(asNumbers).toEqual(expected);
    });

    test('BUG: clicking the same header twice does NOT reverse the sort on this site', async ({ tablePage, page }) => {
      await tablePage.clickSortableHeader('calories');
      await page.waitForTimeout(200);
      const firstOrder = (await tablePage.getSortableColumnValues(1)).join('|');
      await tablePage.clickSortableHeader('calories');
      await page.waitForTimeout(200);
      const secondOrder = (await tablePage.getSortableColumnValues(1)).join('|');
      expect(
        secondOrder,
        'LetCode practice site has a known bug: ascending sort is sticky and does not reverse',
      ).toBe(firstOrder);
    });

    test('BUG: sorting by a different column does NOT reorder rows on this site', async ({ tablePage, page }) => {
      await tablePage.clickSortableHeader('calories');
      await page.waitForTimeout(200);
      const caloriesOrder = (await tablePage.getSortableColumnValues(1)).join('|');
      await tablePage.clickSortableHeader('fat');
      await page.waitForTimeout(200);
      const orderAfterFat = (await tablePage.getSortableColumnValues(1)).join('|');
      expect(
        orderAfterFat,
        'LetCode bug: only the first column click triggers a sort, subsequent header clicks are ignored',
      ).toBe(caloriesOrder);
    });
  });
});
