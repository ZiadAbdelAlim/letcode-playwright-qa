import { test, expect } from '@fixtures/pages.fixture';
import { ensureUploadFixtures } from '@helpers/file-fixtures';
import { statSync } from 'fs';
import { basename } from 'path';

test.describe('File Upload / Download (/file)', () => {
  test.beforeEach(async ({ filePage }) => {
    await filePage.goto();
  });

  test('upload field is present and accepts a single text file', async ({ filePage }) => {
    const { textFile } = ensureUploadFixtures();
    await filePage.uploadFile(textFile);
    const value = await filePage.fileInput.inputValue();
    expect(value).toContain('sample.txt');
  });

  test('upload field accepts multiple files when allowed', async ({ filePage }) => {
    const { textFile, largeFile } = ensureUploadFixtures();
    const isMultiple = await filePage.fileInput.evaluate((el) => (el as HTMLInputElement).multiple);
    if (!isMultiple) {
      await filePage.uploadFile(textFile);
      const value = await filePage.fileInput.inputValue();
      expect(value).toContain('sample.txt');
      return;
    }
    await filePage.uploadFile([textFile, largeFile]);
    const files = await filePage.fileInput.evaluate(
      (el) => (el as HTMLInputElement).files?.length ?? 0,
    );
    expect(files).toBe(2);
  });

  test('upload an empty file', async ({ filePage }) => {
    const { emptyFile } = ensureUploadFixtures();
    await filePage.uploadFile(emptyFile);
    const value = await filePage.fileInput.inputValue();
    expect(value).toContain('empty.txt');
  });

  test('clearing the upload empties the input value', async ({ filePage }) => {
    const { textFile } = ensureUploadFixtures();
    await filePage.uploadFile(textFile);
    await filePage.clearUpload();
    const value = await filePage.fileInput.inputValue();
    expect(value).toBe('');
  });

  for (const variant of [
    { link: 'downloadTextLink' as const, fileName: 'sample.txt' },
    { link: 'downloadPdfLink' as const, fileName: 'sample.pdf' },
    { link: 'downloadExcelLink' as const, fileName: 'sample.xlsx' },
  ]) {
    test(`downloads ${variant.fileName}`, async ({ filePage }) => {
      const download = await filePage.download(filePage[variant.link]);
      expect(download.suggestedFilename()).toBe(variant.fileName);
      const path = await download.path();
      expect(path, 'Download path should be defined').not.toBeNull();
      if (path) {
        expect(statSync(path).size).toBeGreaterThanOrEqual(0);
        expect(basename(path).length).toBeGreaterThan(0);
      }
    });
  }
});
