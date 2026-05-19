import { BrowserContext, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class WindowPage extends BasePage {
  readonly url = Paths.window;

  get openHomeButton(): Locator { return this.page.locator('button#home'); }
  get openMultipleButton(): Locator { return this.page.locator('button#multi'); }

  async openHomeInNewTab(context: BrowserContext): Promise<Page> {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      this.openHomeButton.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  async openMultiple(context: BrowserContext, expectedExtraCount = 1): Promise<Page[]> {
    const before = context.pages().length;
    await this.openMultipleButton.click();
    await this.page.waitForFunction(
      (n) => (window as unknown as { __pwPages?: number }).__pwPages !== undefined || true,
      before + expectedExtraCount,
      { timeout: 1000 },
    ).catch(() => undefined);
    const deadline = Date.now() + 5_000;
    while (Date.now() < deadline && context.pages().length < before + expectedExtraCount) {
      await this.page.waitForTimeout(100);
    }
    return context.pages().filter((p) => p !== this.page);
  }
}
