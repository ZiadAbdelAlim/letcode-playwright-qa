import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class ButtonsPage extends BasePage {
  readonly url = Paths.buttonAlt;

  get homeButton(): Locator { return this.page.locator('button#home'); }
  get locationButton(): Locator { return this.page.locator('button#position'); }
  get colorButton(): Locator { return this.page.locator('button#color'); }
  get sizeButton(): Locator { return this.page.locator('button#property'); }
  get disabledButton(): Locator { return this.page.locator('button#isDisabled[disabled]'); }
  get holdButton(): Locator { return this.page.getByRole('button', { name: /Button Hold!/i }); }

  async clickGoHome(): Promise<void> {
    await this.homeButton.click();
  }

  async getButtonColor(button: Locator): Promise<string> {
    return button.evaluate((el) => getComputedStyle(el).backgroundColor);
  }

  async getButtonBox(button: Locator) {
    const box = await button.boundingBox();
    if (!box) throw new Error('Element not visible — boundingBox returned null');
    return box;
  }

  async holdAndRelease(durationMs: number): Promise<void> {
    const box = await this.getButtonBox(this.holdButton);
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await this.page.mouse.move(cx, cy);
    await this.page.mouse.down();
    await this.page.waitForTimeout(durationMs);
    await this.page.mouse.up();
  }
}
