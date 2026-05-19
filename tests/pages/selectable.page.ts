import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class SelectablePage extends BasePage {
  readonly url = Paths.selectable;

  get container(): Locator { return this.page.locator('#container'); }
  get items(): Locator { return this.container.locator('.list-container > div'); }

  itemByName(name: string): Locator {
    return this.items.filter({ hasText: new RegExp(`^\\s*${name}\\s*$`) });
  }

  async clickAll(): Promise<void> {
    const count = await this.items.count();
    for (let i = 0; i < count; i++) {
      await this.items.nth(i).click();
    }
  }

  async listItemNames(): Promise<string[]> {
    return (await this.items.allTextContents()).map((t) => t.trim()).filter(Boolean);
  }
}
