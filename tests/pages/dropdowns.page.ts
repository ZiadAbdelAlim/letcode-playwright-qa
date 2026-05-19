import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class DropdownsPage extends BasePage {
  readonly url = Paths.dropdowns;

  get fruitsSelect(): Locator { return this.page.locator('select#fruits'); }
  get heroesSelect(): Locator { return this.page.locator('select#superheros'); }
  get languageSelect(): Locator { return this.page.locator('select#lang'); }
  get countrySelect(): Locator { return this.page.locator('select#country'); }

  async selectFruitByLabel(label: string): Promise<void> {
    await this.fruitsSelect.selectOption({ label });
  }

  async selectHeroes(names: string[]): Promise<void> {
    await this.heroesSelect.selectOption(names.map((label) => ({ label })));
  }

  async selectLanguageByIndex(index: number): Promise<string> {
    const options = await this.languageSelect.locator('option').allTextContents();
    await this.languageSelect.selectOption({ index });
    return options[index]?.trim() ?? '';
  }

  async selectCountryByValue(value: string): Promise<void> {
    await this.countrySelect.selectOption(value);
  }

  async getSelectedValue(select: Locator): Promise<string> {
    return select.evaluate((el) => (el as HTMLSelectElement).value);
  }

  async getSelectedLabels(select: Locator): Promise<string[]> {
    return select.evaluate((el) =>
      Array.from((el as HTMLSelectElement).selectedOptions).map((o) => o.textContent?.trim() ?? ''),
    );
  }

  async getAllOptionLabels(select: Locator): Promise<string[]> {
    return select.locator('option').allTextContents().then((all) => all.map((t) => t.trim()));
  }

  async isMultiple(select: Locator): Promise<boolean> {
    return select.evaluate((el) => (el as HTMLSelectElement).multiple);
  }
}
