import { test, expect } from '@fixtures/pages.fixture';

test.describe('Radio & Checkbox (/radio)', () => {
  test.beforeEach(async ({ radioPage }) => {
    await radioPage.goto();
  });

  test.describe('Single-group radio behavior', () => {
    test('selecting Yes deselects No within the same group', async ({ radioPage }) => {
      await radioPage.answerYes.check();
      await expect(radioPage.answerYes).toBeChecked();
      await expect(radioPage.answerNo).not.toBeChecked();

      await radioPage.answerNo.check();
      await expect(radioPage.answerNo).toBeChecked();
      await expect(radioPage.answerYes).not.toBeChecked();
    });

    test('only one radio can be active per name', async ({ radioPage }) => {
      await radioPage.onlyOneYes.check();
      await radioPage.onlyOneNo.check();
      await expect(radioPage.onlyOneYes).not.toBeChecked();
      await expect(radioPage.onlyOneNo).toBeChecked();
    });
  });

  test.describe('Bug detection', () => {
    test('"Find the bug" radios share a UI group but have DIFFERENT name attributes (intentional bug)', async ({
      radioPage,
    }) => {
      const yesName = await radioPage.buggyYes.getAttribute('name');
      const noName = await radioPage.buggyNo.getAttribute('name');
      expect(yesName, 'Bug fixture should expose the wrong name attribute').not.toBe(noName);

      await radioPage.buggyYes.check();
      await radioPage.buggyNo.check();
      await expect(
        radioPage.buggyYes,
        'BUG: both should toggle but the wrong name leaves both selected',
      ).toBeChecked();
      await expect(radioPage.buggyNo).toBeChecked();
    });
  });

  test.describe('Pre-selected radios', () => {
    test('Bar is pre-checked, Foo is not', async ({ radioPage }) => {
      await expect(radioPage.barRadio).toBeChecked();
      await expect(radioPage.fooRadio).not.toBeChecked();
    });

    test('selecting Foo unchecks Bar', async ({ radioPage }) => {
      await radioPage.fooRadio.check();
      await expect(radioPage.fooRadio).toBeChecked();
      await expect(radioPage.barRadio).not.toBeChecked();
    });
  });

  test.describe('Disabled radio', () => {
    test('"Maybe" option is disabled', async ({ radioPage }) => {
      await expect(radioPage.planMaybe).toBeDisabled();
    });

    test('attempting to check a disabled option fails', async ({ radioPage }) => {
      await expect(radioPage.planMaybe.check({ timeout: 1_000 })).rejects.toThrow();
      await expect(radioPage.planMaybe).not.toBeChecked();
    });
  });

  test.describe('Checkbox behavior', () => {
    test('Remember me ships pre-checked', async ({ radioPage }) => {
      await expect(radioPage.rememberMeCheckbox).toBeChecked();
    });

    test('toggling Remember me alternates state', async ({ radioPage }) => {
      const initial = await radioPage.rememberMeCheckbox.isChecked();
      await radioPage.rememberMeCheckbox.click();
      await expect(radioPage.rememberMeCheckbox).toBeChecked({ checked: !initial });
      await radioPage.rememberMeCheckbox.click();
      await expect(radioPage.rememberMeCheckbox).toBeChecked({ checked: initial });
    });

    test('Terms must be checked explicitly', async ({ radioPage }) => {
      await expect(radioPage.termsCheckbox).not.toBeChecked();
      await radioPage.termsCheckbox.check();
      await expect(radioPage.termsCheckbox).toBeChecked();
    });
  });
});
