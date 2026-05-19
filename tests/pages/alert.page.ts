import { Dialog, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class AlertPage extends BasePage {
  readonly url = Paths.alert;

  get simpleAlertButton(): Locator { return this.page.locator('button#accept'); }
  get confirmButton(): Locator { return this.page.locator('button#confirm'); }
  get promptButton(): Locator { return this.page.locator('button#prompt'); }
  get sweetAlertButton(): Locator { return this.page.locator('button#modern'); }
  get sweetModal(): Locator { return this.page.locator('.modal.is-active, .modal').filter({ hasText: 'Modern Alert' }); }
  get sweetModalCloseButton(): Locator { return this.page.locator('button.modal-close'); }

  oncePromise(action: 'accept' | 'dismiss', text?: string): Promise<Dialog> {
    return new Promise<Dialog>((resolve) => {
      const handler = async (dialog: Dialog) => {
        this.page.off('dialog', handler);
        if (action === 'accept') {
          await dialog.accept(text);
        } else {
          await dialog.dismiss();
        }
        resolve(dialog);
      };
      this.page.on('dialog', handler);
    });
  }
}
