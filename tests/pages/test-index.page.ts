import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class TestIndexPage extends BasePage {
  readonly url = Paths.testIndex;

  get menuCards(): Locator {
    return this.page.locator('app-menu');
  }

  get pageTitle(): Locator {
    return this.page.getByRole('heading', { name: /Ready to be a Pro Engineer/i });
  }

  cardByTitle(title: string): Locator {
    return this.menuCards.filter({
      has: this.page.locator('.card-header-title', { hasText: new RegExp(`^\\s*${title}\\s*$`, 'i') }),
    });
  }

  cardLink(title: string): Locator {
    return this.cardByTitle(title).getByRole('link');
  }

  async clickCard(title: string): Promise<void> {
    await this.cardLink(title).click();
  }

  async listCardTitles(): Promise<string[]> {
    const titles = await this.menuCards.locator('.card-header-title').allTextContents();
    return titles.map((t) => t.trim());
  }
}
