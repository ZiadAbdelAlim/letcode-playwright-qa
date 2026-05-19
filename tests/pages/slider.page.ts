import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class SliderPage extends BasePage {
  readonly url = Paths.slider;

  get slider(): Locator { return this.page.locator('input#generate'); }
  get heading(): Locator {
    return this.page.getByRole('heading', { name: /Word limit/i });
  }
  get getCountriesButton(): Locator {
    return this.page.getByRole('button', { name: /Get Countries/i });
  }
  get countriesList(): Locator {
    return this.page.locator('.list, .countries-list, ul, .block').filter({ hasText: /,/ }).first();
  }

  async setValue(value: number): Promise<void> {
    await this.slider.evaluate((el, v) => {
      const input = el as HTMLInputElement;
      input.value = String(v);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
  }

  async getValue(): Promise<number> {
    return Number(await this.slider.inputValue());
  }

  async getMin(): Promise<number> {
    return Number(await this.slider.getAttribute('min'));
  }

  async getMax(): Promise<number> {
    return Number(await this.slider.getAttribute('max'));
  }

  async clickGetCountries(): Promise<void> {
    await this.getCountriesButton.click();
  }
}
