import { Download, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class FilePage extends BasePage {
  readonly url = Paths.file;

  get fileInput(): Locator { return this.page.locator('input[type="file"][name="resume"]'); }
  get fileLabel(): Locator { return this.page.locator('.file-label .file-label').first(); }

  get downloadExcelLink(): Locator { return this.page.locator('a#xls'); }
  get downloadPdfLink(): Locator { return this.page.locator('a#pdf'); }
  get downloadTextLink(): Locator { return this.page.locator('a#txt'); }

  async uploadFile(path: string | string[]): Promise<void> {
    await this.fileInput.setInputFiles(path);
  }

  async clearUpload(): Promise<void> {
    await this.fileInput.setInputFiles([]);
  }

  async download(link: Locator): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      link.click(),
    ]);
    return download;
  }
}
