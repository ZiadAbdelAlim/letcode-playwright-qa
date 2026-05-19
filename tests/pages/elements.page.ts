import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class ElementsPage extends BasePage {
  readonly url = Paths.elements;

  get usernameInput(): Locator { return this.page.locator('input[name="username"]'); }
  get searchButton(): Locator { return this.page.locator('button#search'); }
  get profileImage(): Locator { return this.page.locator('figure img, img.is-rounded, .image img'); }
  get profileName(): Locator { return this.page.locator('h1, h2').first(); }
  get publicRepoCount(): Locator {
    return this.page.locator('p, span').filter({ hasText: /Public Repos/i }).first();
  }
  get repoLinks(): Locator {
    return this.page.locator('a[href*="github.com"]:not([href$="github.com"])');
  }

  async searchUser(username: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.searchButton.click();
  }
}
