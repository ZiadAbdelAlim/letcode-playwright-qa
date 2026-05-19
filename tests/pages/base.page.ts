import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  abstract readonly url: string;

  constructor(public readonly page: Page) {}

  async goto(): Promise<this> {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    return this;
  }

  async waitForReady(): Promise<this> {
    await this.page.waitForLoadState('domcontentloaded');
    return this;
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  get pageHeading(): Locator {
    return this.page.locator('app-pageheader, section.section h1').first();
  }

  async assertOnPage(expectedPath?: string): Promise<void> {
    const path = expectedPath ?? this.url;
    await expect(this.page).toHaveURL(new RegExp(`${path.replace(/\//g, '\\/')}$`));
  }

  async scrollTo(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }
}
