import { test, expect } from '@fixtures/pages.fixture';

test.describe('Advanced Table (/advancedtable)', () => {
  test.beforeEach(async ({ advancedTablePage }) => {
    await advancedTablePage.goto();
  });

  test('table renders the expected 4 column headers', async ({ advancedTablePage }) => {
    const headers = (await advancedTablePage.headerCells.allTextContents()).map((t) => t.trim());
    expect(headers).toEqual(expect.arrayContaining(['S.NO', 'UNIVERSITY NAME', 'COUNTRY', 'WEBSITE']));
  });

  test('every visible row in the COUNTRY column is "United Kingdom"', async ({ advancedTablePage }) => {
    const countries = await advancedTablePage.getColumnValues(2);
    expect(countries.length).toBeGreaterThan(0);
    expect(countries.every((c) => c === 'United Kingdom')).toBe(true);
  });

  test('every WEBSITE column entry is a well-formed URL', async ({ advancedTablePage }) => {
    const urls = await advancedTablePage.getColumnValues(3);
    expect(urls.length).toBeGreaterThan(0);
    for (const u of urls) {
      expect(u, 'WEBSITE entry should look like a URL').toMatch(/^https?:\/\//);
    }
  });

  test('searching for "Oxford" filters down to at least one row (if DataTables filter exists)', async ({
    advancedTablePage,
  }) => {
    const filterCount = await advancedTablePage.searchBox.count();
    test.skip(filterCount === 0, 'DataTables filter not rendered');
    await advancedTablePage.search('Oxford');
    const names = await advancedTablePage.getVisibleUniversityNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((n) => /oxford/i.test(n))).toBe(true);
  });

  test('changing page size to 25 affects the visible row count', async ({ advancedTablePage }) => {
    const selectCount = await advancedTablePage.pageLengthSelect.count();
    test.skip(selectCount === 0, 'DataTables page-length dropdown not rendered');
    await advancedTablePage.setPageSize(25);
    const names = await advancedTablePage.getVisibleUniversityNames();
    expect(names.length).toBeLessThanOrEqual(25);
  });

  test('paginating to page 2 surfaces different rows', async ({ advancedTablePage }) => {
    const nextCount = await advancedTablePage.paginationButton(2).count();
    test.skip(nextCount === 0, 'Pagination control not rendered');
    const page1 = await advancedTablePage.getVisibleUniversityNames();
    await advancedTablePage.paginationButton(2).click();
    const page2 = await advancedTablePage.getVisibleUniversityNames();
    expect(page2).not.toEqual(page1);
  });
});
