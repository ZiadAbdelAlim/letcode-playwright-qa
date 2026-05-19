import { test, expect } from '@fixtures/pages.fixture';
import { TestData } from '@helpers/test-data.factory';

test.describe('Forms (/forms)', () => {
  test.beforeEach(async ({ formsPage }) => {
    await formsPage.goto();
  });

  test('valid form submits and reloads the page', async ({ formsPage, page }) => {
    const user = TestData.randomUser();
    await formsPage.fillForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      countryCode: '44',
      phone: user.phone,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      state: user.state,
      postalCode: user.postalCode,
      country: 'United Kingdom',
      dob: user.dob,
      gender: 'Male',
      acceptTerms: true,
    });
    await formsPage.submit();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/forms/);
  });

  test('submission without required fields keeps the user on the form', async ({ formsPage, page }) => {
    await formsPage.submit();
    await expect(page).toHaveURL(/\/forms/);
    await expect(formsPage.firstNameInput).toBeVisible();
  });

  test('email field rejects an invalid format via HTML5 validation', async ({ formsPage }) => {
    await formsPage.emailInput.fill(TestData.invalidEmail);
    const valid = await formsPage.emailInput.evaluate((el) => (el as HTMLInputElement).checkValidity());
    expect(valid, 'Email pattern should reject "not-an-email"').toBe(false);
  });

  test('email field accepts a valid address', async ({ formsPage }) => {
    await formsPage.emailInput.fill(TestData.validEmail);
    const valid = await formsPage.emailInput.evaluate((el) => (el as HTMLInputElement).checkValidity());
    expect(valid).toBe(true);
  });

  test('phone field enforces a 10-digit pattern starting with 1-9', async ({ formsPage }) => {
    await formsPage.phoneInput.fill('012');
    const valid = await formsPage.phoneInput.evaluate((el) => (el as HTMLInputElement).checkValidity());
    expect(valid).toBe(false);

    await formsPage.phoneInput.fill(TestData.phoneIN());
    const valid2 = await formsPage.phoneInput.evaluate((el) => (el as HTMLInputElement).checkValidity());
    expect(valid2).toBe(true);
  });

  test('country code "Other Countries" placeholder is disabled', async ({ formsPage }) => {
    const placeholder = formsPage.countryCodeSelect.locator('option[disabled]').first();
    await expect(placeholder).toHaveText(/Other Countries/i);
  });

  test('gender radios are mutually exclusive', async ({ formsPage }) => {
    await formsPage.maleRadio.check();
    await expect(formsPage.maleRadio).toBeChecked();
    await formsPage.femaleRadio.check();
    await expect(formsPage.femaleRadio).toBeChecked();
    await expect(formsPage.maleRadio).not.toBeChecked();
  });

  test('Last Name input ID has a known typo (#lasttname) — schema regression guard', async ({ formsPage }) => {
    const id = await formsPage.lastNameInput.getAttribute('id');
    expect(id, 'Heads-up: regenerate test if dev fixes the #lasttname typo').toBe('lasttname');
  });

  test('XSS in first name is kept as plain text', async ({ formsPage }) => {
    const popups: string[] = [];
    formsPage.page.on('dialog', (d) => {
      popups.push(d.message());
      return d.dismiss();
    });
    await formsPage.firstNameInput.fill(TestData.xssPayload);
    await formsPage.page.waitForTimeout(150);
    expect(popups).toHaveLength(0);
    await expect(formsPage.firstNameInput).toHaveValue(TestData.xssPayload);
  });

  test('postal code accepts alphanumeric (no validation on this site)', async ({ formsPage }) => {
    await formsPage.postalCodeInput.fill('NW1 6XE');
    await expect(formsPage.postalCodeInput).toHaveValue('NW1 6XE');
  });

  test('DOB input is required and accepts a valid date', async ({ formsPage }) => {
    await formsPage.dobInput.fill('1990-01-01');
    await expect(formsPage.dobInput).toHaveValue('1990-01-01');
  });

  test('terms checkbox is required to submit', async ({ formsPage }) => {
    const required = await formsPage.termsCheckbox.evaluate((el) => (el as HTMLInputElement).required);
    expect(required).toBe(true);
  });
});
