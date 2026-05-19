import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class RadioPage extends BasePage {
  readonly url = Paths.radio;

  get answerYes(): Locator { return this.page.locator('input#yes'); }
  get answerNo(): Locator { return this.page.locator('input#no'); }

  get onlyOneYes(): Locator { return this.page.locator('input#one'); }
  get onlyOneNo(): Locator { return this.page.locator('input#two'); }

  get buggyYes(): Locator { return this.page.locator('input#nobug'); }
  get buggyNo(): Locator { return this.page.locator('input#bug'); }

  get fooRadio(): Locator { return this.page.locator('input#foo'); }
  get barRadio(): Locator { return this.page.locator('input#notfoo'); }

  get planGoing(): Locator { return this.page.locator('input#going'); }
  get planNotGoing(): Locator { return this.page.locator('input#notG'); }
  get planMaybe(): Locator { return this.page.locator('input#maybe'); }

  get rememberMeCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: /Remember me/i });
  }
  get termsCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: /I agree/i });
  }
}
