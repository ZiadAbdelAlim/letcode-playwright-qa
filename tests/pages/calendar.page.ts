import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class CalendarPage extends BasePage {
  readonly url = Paths.calendar;

  get birthdayInput(): Locator { return this.page.locator('input#birthday[type="date"]'); }

  async setBirthday(iso: string): Promise<void> {
    await this.birthdayInput.fill(iso);
    await this.birthdayInput.dispatchEvent('change');
  }

  async getBirthday(): Promise<string> {
    return this.birthdayInput.inputValue();
  }
}
