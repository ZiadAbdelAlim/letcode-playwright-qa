import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class AdvancedTablePage extends BasePage {
  readonly url = Paths.advancedTable;

  get table(): Locator { return this.page.locator('table#advancedtable'); }
  get headerCells(): Locator { return this.table.locator('thead th'); }
  get bodyRows(): Locator { return this.table.locator('tbody tr'); }

  get searchBox(): Locator {
    return this.page.locator('div.dataTables_filter input, input[type="search"]').first();
  }

  get pageInfo(): Locator {
    return this.page.locator('.dataTables_info').first();
  }

  get pageLengthSelect(): Locator {
    return this.page.locator('div.dataTables_length select, select[name$="_length"]').first();
  }

  paginationButton(label: string | number): Locator {
    return this.page.locator('.paginate_button, a.paginate_button').filter({
      hasText: new RegExp(`^\\s*${label}\\s*$`),
    }).first();
  }

  async search(text: string): Promise<void> {
    const box = this.searchBox;
    await box.fill(text);
  }

  async setPageSize(size: number): Promise<void> {
    const dropdown = this.pageLengthSelect;
    if ((await dropdown.count()) > 0) {
      await dropdown.selectOption(String(size));
    }
  }

  async getVisibleUniversityNames(): Promise<string[]> {
    return this.bodyRows.evaluateAll((rows) =>
      rows
        .filter((r) => (r as HTMLElement).offsetParent !== null)
        .map((r) => r.querySelectorAll('td')[1]?.textContent?.trim() ?? ''),
    );
  }

  async getTotalRowCountText(): Promise<string> {
    return (await this.pageInfo.textContent()) ?? '';
  }

  async clickHeader(index: number): Promise<void> {
    await this.headerCells.nth(index).click();
  }

  async getColumnValues(index: number): Promise<string[]> {
    return this.bodyRows.evaluateAll(
      (rows, idx) =>
        rows
          .filter((r) => (r as HTMLElement).offsetParent !== null)
          .map((r) => r.querySelectorAll('td')[idx]?.textContent?.trim() ?? ''),
      index,
    );
  }
}
