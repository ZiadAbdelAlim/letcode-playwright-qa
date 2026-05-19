import { test, expect } from '@fixtures/pages.fixture';

test.describe('Dropdowns (/dropdowns)', () => {
  test.beforeEach(async ({ dropdownsPage }) => {
    await dropdownsPage.goto();
  });

  test.describe('Fruits — select by visible label', () => {
    test('selects Apple', async ({ dropdownsPage }) => {
      await dropdownsPage.selectFruitByLabel('Apple');
      const selected = await dropdownsPage.getSelectedLabels(dropdownsPage.fruitsSelect);
      expect(selected).toEqual(['Apple']);
    });

    test('selecting a non-existent option throws', async ({ dropdownsPage }) => {
      await expect(
        dropdownsPage.selectFruitByLabel('Dragon Fruit'),
        'Unknown label should reject',
      ).rejects.toThrow();
    });
  });

  test.describe('Super heroes — multi-select', () => {
    test('fruits dropdown is single-select, heroes dropdown is multi-select', async ({ dropdownsPage }) => {
      expect(await dropdownsPage.isMultiple(dropdownsPage.fruitsSelect)).toBe(false);
      expect(await dropdownsPage.isMultiple(dropdownsPage.heroesSelect)).toBe(true);
    });

    test('selects multiple heroes', async ({ dropdownsPage }) => {
      const choices = ['Aquaman', 'Batman', 'Iron Man'];
      await dropdownsPage.selectHeroes(choices);
      const selected = await dropdownsPage.getSelectedLabels(dropdownsPage.heroesSelect);
      expect(selected.sort()).toEqual([...choices].sort());
    });

    test('selecting heroes overwrites previous selection (single call)', async ({ dropdownsPage }) => {
      await dropdownsPage.selectHeroes(['Aquaman', 'Batman']);
      await dropdownsPage.selectHeroes(['Thor']);
      const selected = await dropdownsPage.getSelectedLabels(dropdownsPage.heroesSelect);
      expect(selected).toEqual(['Thor']);
    });
  });

  test.describe('Programming languages — select by index', () => {
    test('selects last option (C#)', async ({ dropdownsPage }) => {
      const optionLabels = await dropdownsPage.getAllOptionLabels(dropdownsPage.languageSelect);
      expect(optionLabels.length).toBeGreaterThan(0);
      const lastIndex = optionLabels.length - 1;
      const expected = optionLabels[lastIndex];
      await dropdownsPage.selectLanguageByIndex(lastIndex);
      const selected = await dropdownsPage.getSelectedLabels(dropdownsPage.languageSelect);
      expect(selected).toEqual([expected]);
    });

    test('out-of-range index does not change selection', async ({ dropdownsPage }) => {
      const before = await dropdownsPage.getSelectedValue(dropdownsPage.languageSelect);
      await dropdownsPage.languageSelect.selectOption({ index: 999 }).catch(() => undefined);
      const after = await dropdownsPage.getSelectedValue(dropdownsPage.languageSelect);
      expect(after, 'Selection should not change on bad index').toBe(before);
    });
  });

  test.describe('Country — select by value', () => {
    test('selects India by value and reads it back', async ({ dropdownsPage }) => {
      await dropdownsPage.selectCountryByValue('India');
      const value = await dropdownsPage.getSelectedValue(dropdownsPage.countrySelect);
      expect(value).toBe('India');
    });
  });
});
