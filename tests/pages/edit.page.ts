import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class EditPage extends BasePage {
  readonly url = Paths.edit;

  get fullNameInput(): Locator { return this.page.locator('#fullName'); }
  get appendInput(): Locator { return this.page.locator('#join'); }
  get presetInput(): Locator { return this.page.locator('#getMe'); }
  get clearableInput(): Locator { return this.page.locator('#clearMe'); }
  get disabledInput(): Locator { return this.page.locator('#noEdit'); }
  get readonlyInput(): Locator { return this.page.locator('#dontwrite'); }

  async typeFullName(name: string): Promise<void> {
    await this.fullNameInput.fill(name);
  }

  async appendAndTab(suffix: string): Promise<void> {
    await this.appendInput.focus();
    await this.appendInput.press('End');
    await this.page.keyboard.type(suffix);
    await this.appendInput.press('Tab');
  }

  async getPresetValue(): Promise<string> {
    return (await this.presetInput.inputValue()) ?? '';
  }

  async clearClearable(): Promise<void> {
    await this.clearableInput.fill('');
  }
}
