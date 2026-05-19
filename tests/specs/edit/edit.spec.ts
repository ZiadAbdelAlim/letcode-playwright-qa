import { test, expect } from '@fixtures/pages.fixture';
import { TestData } from '@helpers/test-data.factory';

test.describe('Input Fields (/edit)', () => {
  test.beforeEach(async ({ editPage }) => {
    await editPage.goto();
  });

  test.describe('Happy path', () => {
    test('types a full name and value is reflected', async ({ editPage }) => {
      const name = TestData.fullName();
      await editPage.typeFullName(name);
      await expect(editPage.fullNameInput, 'Input should retain typed name').toHaveValue(name);
    });

    test('appends text after preset value and tabs out', async ({ editPage }) => {
      const initial = await editPage.appendInput.inputValue();
      await editPage.appendAndTab(TestData.appendText());
      const final = await editPage.appendInput.inputValue();
      expect(final.startsWith(initial), 'Pre-existing value must be preserved').toBe(true);
      expect(final.length).toBeGreaterThan(initial.length);
      await expect(editPage.appendInput, 'Tab should move focus away').not.toBeFocused();
    });

    test('reads preset value (getAttribute style)', async ({ editPage }) => {
      const value = await editPage.getPresetValue();
      expect(value, 'Preset input should ship with a value').not.toEqual('');
    });

    test('clears a pre-populated input', async ({ editPage }) => {
      const before = await editPage.clearableInput.inputValue();
      expect(before, 'Pre-populated input must start with a value').not.toBe('');
      await editPage.clearClearable();
      await expect(editPage.clearableInput).toHaveValue('');
    });
  });

  test.describe('State assertions', () => {
    test('disabled input cannot be edited', async ({ editPage }) => {
      await expect(editPage.disabledInput).toBeDisabled();
      await editPage.disabledInput.click({ force: true }).catch(() => undefined);
      await expect(editPage.disabledInput, 'Disabled input must stay empty').toHaveValue('');
    });

    test('readonly input has a readonly attribute and rejects edits', async ({ editPage }) => {
      const original = await editPage.readonlyInput.inputValue();
      await expect(editPage.readonlyInput).toHaveAttribute('readonly', '');
      await editPage.readonlyInput.click();
      await editPage.page.keyboard.type('SHOULD NOT APPEAR');
      await expect(
        editPage.readonlyInput,
        'Readonly value must not change',
      ).toHaveValue(original);
    });
  });

  test.describe('Edge cases & negative scenarios', () => {
    test('handles emoji and unicode in name field', async ({ editPage }) => {
      await editPage.typeFullName(TestData.emojiString);
      await expect(editPage.fullNameInput).toHaveValue(TestData.emojiString);
    });

    test('handles very long input (1000 chars)', async ({ editPage }) => {
      const long = TestData.longString(1000);
      await editPage.typeFullName(long);
      expect((await editPage.fullNameInput.inputValue()).length).toBe(1000);
    });

    test('preserves whitespace when typed verbatim', async ({ editPage }) => {
      await editPage.typeFullName(TestData.whitespaceString);
      await expect(editPage.fullNameInput).toHaveValue(TestData.whitespaceString);
    });

    test('XSS payload is treated as plain text', async ({ editPage }) => {
      await editPage.typeFullName(TestData.xssPayload);
      const popupSpy: string[] = [];
      editPage.page.on('dialog', (d) => {
        popupSpy.push(d.message());
        return d.dismiss();
      });
      await editPage.page.waitForTimeout(150);
      expect(popupSpy, 'XSS string must not trigger a real alert').toHaveLength(0);
      await expect(editPage.fullNameInput).toHaveValue(TestData.xssPayload);
    });

    test('typing into a non-existent field does not crash the page', async ({ editPage, page }) => {
      const ghost = page.locator('#thisDoesNotExist');
      await expect(ghost).toHaveCount(0);
      await expect(editPage.fullNameInput).toBeVisible();
    });

    test('tabbing across all editable fields preserves expected focus order', async ({ editPage }) => {
      await editPage.fullNameInput.focus();
      await editPage.page.keyboard.press('Tab');
      await expect(editPage.appendInput, 'Tab → next field').toBeFocused();
      await editPage.page.keyboard.press('Tab');
      await expect(editPage.presetInput).toBeFocused();
    });
  });
});
