import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export type FormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  postalCode: string;
  country: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Transgender';
  acceptTerms?: boolean;
};

export class FormsPage extends BasePage {
  readonly url = Paths.forms;

  get firstNameInput(): Locator { return this.page.locator('input#firstname'); }
  get lastNameInput(): Locator { return this.page.locator('input#lasttname'); }
  get emailInput(): Locator { return this.page.locator('input#email'); }
  get phoneInput(): Locator { return this.page.locator('input#Phno'); }
  get addressLine1Input(): Locator { return this.page.locator('input#Addl1'); }
  get addressLine2Input(): Locator { return this.page.locator('input#Addl2'); }
  get stateInput(): Locator { return this.page.locator('input#state'); }
  get postalCodeInput(): Locator { return this.page.locator('input#postalcode'); }
  get dobInput(): Locator { return this.page.locator('input#Date'); }
  get countryCodeSelect(): Locator {
    return this.page.locator('label#countrycode').locator('xpath=ancestor::div[contains(@class,"field")][1]').locator('select');
  }
  get countrySelect(): Locator {
    return this.page.locator('label#country').locator('xpath=ancestor::div[contains(@class,"field")][1]').locator('select');
  }
  get maleRadio(): Locator { return this.page.locator('input#male'); }
  get femaleRadio(): Locator { return this.page.locator('input#female'); }
  get transRadio(): Locator { return this.page.locator('input#trans'); }
  get termsCheckbox(): Locator { return this.page.getByRole('checkbox', { name: /I agree/i }); }
  get submitButton(): Locator { return this.page.locator('input[type="submit"]'); }

  genderRadio(g: FormPayload['gender']): Locator {
    if (g === 'Male') return this.maleRadio;
    if (g === 'Female') return this.femaleRadio;
    return this.transRadio;
  }

  async fillForm(p: FormPayload): Promise<void> {
    await this.firstNameInput.fill(p.firstName);
    await this.lastNameInput.fill(p.lastName);
    await this.emailInput.fill(p.email);
    await this.countryCodeSelect.selectOption(p.countryCode);
    await this.phoneInput.fill(p.phone);
    await this.addressLine1Input.fill(p.addressLine1);
    await this.addressLine2Input.fill(p.addressLine2);
    await this.stateInput.fill(p.state);
    await this.postalCodeInput.fill(p.postalCode);
    await this.countrySelect.selectOption(p.country);
    await this.dobInput.fill(p.dob);
    await this.genderRadio(p.gender).check();
    if (p.acceptTerms !== false) await this.termsCheckbox.check();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
