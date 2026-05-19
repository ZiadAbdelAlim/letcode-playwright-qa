import { FrameLocator, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class FramePage extends BasePage {
  readonly url = Paths.frame;

  get outerFrame(): FrameLocator {
    return this.page.frameLocator('iframe#firstFr');
  }

  get innerFrame(): FrameLocator {
    return this.outerFrame.frameLocator('iframe[src="innerframe"]');
  }

  get outerFirstName(): Locator {
    return this.outerFrame.locator('input[name="fname"]');
  }

  get outerLastName(): Locator {
    return this.outerFrame.locator('input[name="lname"]');
  }

  get innerEmail(): Locator {
    return this.innerFrame.locator('input[name="email"]');
  }

  async fillOuterDetails(first: string, last: string): Promise<void> {
    await this.outerFirstName.fill(first);
    await this.outerLastName.fill(last);
  }

  async fillInnerEmail(email: string): Promise<void> {
    await this.innerEmail.fill(email);
  }
}
