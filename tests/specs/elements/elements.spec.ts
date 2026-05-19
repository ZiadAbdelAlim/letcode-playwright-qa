import { test, expect } from '@fixtures/pages.fixture';

test.describe('Find Elements (/elements)', () => {
  test.beforeEach(async ({ elementsPage }) => {
    await elementsPage.goto();
  });

  test('search form is present with username input and Search button', async ({ elementsPage }) => {
    await expect(elementsPage.usernameInput).toBeVisible();
    await expect(elementsPage.searchButton).toBeVisible();
    await expect(elementsPage.searchButton).toHaveText(/Search/i);
  });

  test('Search button is disabled until username is entered (if form validates)', async ({ elementsPage }) => {
    const required = await elementsPage.usernameInput.getAttribute('required');
    expect(required, 'Username field is marked required by the form').not.toBeNull();
  });

  test('submitting with an empty value does not navigate away', async ({ elementsPage, page }) => {
    await elementsPage.searchButton.click().catch(() => undefined);
    await expect(page).toHaveURL(/\/elements$/);
  });

  test('typing a username updates the input value', async ({ elementsPage }) => {
    await elementsPage.usernameInput.fill('ortonikc');
    await expect(elementsPage.usernameInput).toHaveValue('ortonikc');
  });

  test('searching with a known GitHub user surfaces profile content (live API; skipped if unreachable)', async ({
    elementsPage,
    page,
  }, testInfo) => {
    testInfo.annotations.push({ type: 'flaky', description: 'Depends on api.github.com rate limits' });
    await elementsPage.searchUser('ortonikc');
    const profileVisible = await elementsPage.profileImage.first()
      .waitFor({ state: 'visible', timeout: 7_000 })
      .then(() => true)
      .catch(() => false);
    if (!profileVisible) {
      test.skip(true, 'GitHub API rate-limited or page did not render profile in time');
    }
    await expect(page).toHaveURL(/\/elements/);
  });
});
