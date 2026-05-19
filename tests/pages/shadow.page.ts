import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class ShadowPage extends BasePage {
  readonly url = Paths.shadow;

  get host(): Locator { return this.page.locator('my-web-component'); }

  get input(): Locator {
    return this.host.locator('input').first();
  }

  get button(): Locator {
    return this.host.locator('button').first();
  }

  get openShadowContainer(): Locator { return this.page.locator('#open-shadow'); }
  get closeShadowContainer(): Locator { return this.page.locator('#close-shadow'); }

  async typeIntoShadowInput(value: string): Promise<void> {
    await this.input.fill(value);
  }

  async readShadowInputValue(): Promise<string> {
    return this.input.inputValue();
  }

  async clickShadowButton(): Promise<void> {
    if ((await this.button.count()) > 0) {
      await this.button.click();
    }
  }
}
