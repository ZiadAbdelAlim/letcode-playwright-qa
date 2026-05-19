import { Dialog, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class WaitsPage extends BasePage {
  readonly url = Paths.waits;

  get acceptButton(): Locator { return this.page.locator('button#accept'); }

  async clickAndAcceptDelayedAlert(timeoutMs = 15_000): Promise<string> {
    const dialogPromise = new Promise<Dialog>((resolve) => {
      const handler = (dialog: Dialog) => {
        this.page.off('dialog', handler);
        resolve(dialog);
      };
      this.page.on('dialog', handler);
    });
    await this.acceptButton.click();
    const dialog = await Promise.race([
      dialogPromise,
      new Promise<Dialog>((_, reject) =>
        setTimeout(() => reject(new Error(`Alert did not appear within ${timeoutMs}ms`)), timeoutMs),
      ),
    ]);
    const message = dialog.message();
    await dialog.accept();
    return message;
  }
}
