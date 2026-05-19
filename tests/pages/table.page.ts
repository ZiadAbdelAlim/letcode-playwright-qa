import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class TablePage extends BasePage {
  readonly url = Paths.table;

  get shoppingTable(): Locator { return this.page.locator('table#shopping'); }
  get shoppingRows(): Locator { return this.shoppingTable.locator('tbody tr'); }
  get shoppingTotalDisplayed(): Locator {
    return this.shoppingTable.locator('tfoot td b, tfoot b').first();
  }

  get attendanceTable(): Locator { return this.page.locator('table#simpletable'); }
  get attendanceRows(): Locator { return this.attendanceTable.locator('tbody tr'); }

  get sortableTable(): Locator { return this.page.locator('table.mat-sort'); }

  async getShoppingPrices(): Promise<number[]> {
    const cellsByRow = await this.shoppingRows.evaluateAll((rows) =>
      rows.map((r) => Array.from(r.querySelectorAll('td')).map((c) => c.textContent?.trim() ?? '')),
    );
    return cellsByRow.map((row) => Number(row[1]));
  }

  async getDisplayedShoppingTotal(): Promise<number> {
    return Number((await this.shoppingTotalDisplayed.textContent())?.trim());
  }

  attendanceRowByName(firstName: string): Locator {
    return this.attendanceRows.filter({ hasText: firstName });
  }

  async markAttendanceFor(firstName: string): Promise<void> {
    const row = this.attendanceRowByName(firstName);
    await row.locator('input[type="checkbox"]').check();
  }

  async isAttendanceChecked(firstName: string): Promise<boolean> {
    const row = this.attendanceRowByName(firstName);
    return row.locator('input[type="checkbox"]').isChecked();
  }

  async getSortableColumnValues(columnIndex: number): Promise<string[]> {
    return this.sortableTable.locator('tbody tr, tr.ng-star-inserted').evaluateAll(
      (rows, idx) =>
        rows.map((r) => r.querySelectorAll('td')[idx]?.textContent?.trim() ?? ''),
      columnIndex,
    );
  }

  async clickSortableHeader(headerName: string): Promise<void> {
    await this.sortableTable.locator(`th[mat-sort-header="${headerName}"]`).click();
  }

  async getSortableAriaSort(headerName: string): Promise<string> {
    return (
      (await this.sortableTable
        .locator(`th[mat-sort-header="${headerName}"]`)
        .getAttribute('aria-sort')) ?? 'none'
    );
  }
}
