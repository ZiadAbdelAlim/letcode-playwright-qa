import { test, expect } from '@fixtures/pages.fixture';
import { TestData } from '@helpers/test-data.factory';

test.describe('Calendar (/calendar)', () => {
  test.beforeEach(async ({ calendarPage }) => {
    await calendarPage.goto();
  });

  test('input is a native HTML5 date picker', async ({ calendarPage }) => {
    await expect(calendarPage.birthdayInput).toHaveAttribute('type', 'date');
  });

  test('selects a fixed birthday', async ({ calendarPage }) => {
    await calendarPage.setBirthday('1995-06-15');
    expect(await calendarPage.getBirthday()).toBe('1995-06-15');
  });

  test('selects a dynamic past date', async ({ calendarPage }) => {
    const past = TestData.pastDate(30);
    await calendarPage.setBirthday(past);
    expect(await calendarPage.getBirthday()).toBe(past);
  });

  test('accepts today as a valid date', async ({ calendarPage }) => {
    const today = TestData.todayISO();
    await calendarPage.setBirthday(today);
    expect(await calendarPage.getBirthday()).toBe(today);
  });

  test('accepts a future date (no upper-bound validation on this site)', async ({ calendarPage }) => {
    const future = TestData.futureDate(5);
    await calendarPage.setBirthday(future);
    expect(await calendarPage.getBirthday()).toBe(future);
  });

  test('clearing the input leaves it empty', async ({ calendarPage }) => {
    await calendarPage.setBirthday('1995-06-15');
    await calendarPage.birthdayInput.fill('');
    expect(await calendarPage.getBirthday()).toBe('');
  });
});
