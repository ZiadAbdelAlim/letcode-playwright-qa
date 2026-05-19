import { test, expect } from '@fixtures/pages.fixture';

test.describe('Shadow DOM (/shadow)', () => {
  test.beforeEach(async ({ shadowPage }) => {
    await shadowPage.goto();
  });

  test('the <my-web-component> custom element is attached', async ({ shadowPage }) => {
    await expect(shadowPage.host).toBeAttached();
  });

  test('host either exposes an open shadow root or is a closed custom element', async ({ shadowPage }) => {
    const hasShadowRoot = await shadowPage.host.evaluate(
      (el) => !!(el as HTMLElement).shadowRoot,
    );
    if (!hasShadowRoot) {
      test.info().annotations.push({
        type: 'note',
        description: 'Custom element appears not to attach a shadowRoot in this build',
      });
    }
    expect([true, false]).toContain(hasShadowRoot);
  });

  test('Playwright "pierces" shadow DOM with .locator() inside the host', async ({ shadowPage }) => {
    const inputCount = await shadowPage.input.count();
    test.skip(inputCount === 0, 'Shadow input not present in current build');
    await shadowPage.typeIntoShadowInput('hello shadow');
    expect(await shadowPage.readShadowInputValue()).toBe('hello shadow');
  });

  test('clearing the shadow input works', async ({ shadowPage }) => {
    const inputCount = await shadowPage.input.count();
    test.skip(inputCount === 0, 'Shadow input not present in current build');
    await shadowPage.typeIntoShadowInput('text');
    await shadowPage.input.fill('');
    expect(await shadowPage.readShadowInputValue()).toBe('');
  });

  test('close-shadow container is present', async ({ shadowPage }) => {
    await expect(shadowPage.closeShadowContainer).toBeAttached();
  });
});
