import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class ProductsPage extends BasePage {
  readonly url = Paths.pom;

  get pageHeading(): Locator { return this.page.getByRole('heading', { name: 'Fake Store', exact: true }); }
  get productsHeading(): Locator { return this.page.getByRole('heading', { name: 'Products', exact: true }); }
  get productCards(): Locator { return this.page.locator('app-home .card'); }
  get productTitles(): Locator { return this.productCards.locator('.card-header-title'); }
  get productPrices(): Locator { return this.productCards.locator('.card-footer-item'); }
  get cartButton(): Locator { return this.page.locator('button .fa-cart-shopping').locator('xpath=ancestor::button[1]'); }
  get userButton(): Locator { return this.page.locator('button .fa-user').locator('xpath=ancestor::button[1]'); }

  cardByTitle(text: string): Locator {
    return this.productCards.filter({
      has: this.page.locator('.card-header-title', { hasText: new RegExp(text, 'i') }),
    });
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async getTitles(): Promise<string[]> {
    return (await this.productTitles.allTextContents()).map((t) => t.trim());
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map((t) => Number(t.replace(/[^0-9.]/g, '')));
  }
}
