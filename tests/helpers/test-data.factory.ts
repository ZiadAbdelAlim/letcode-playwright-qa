import { randomBytes, randomInt } from 'crypto';

export const TestData = {
  validEmail: 'test.user@example.com',
  invalidEmail: 'not-an-email',
  longString: (length: number): string => 'a'.repeat(length),
  sqlInjection: "' OR '1'='1",
  xssPayload: '<script>alert(1)</script>',
  emojiString: '🚀✅ unicode 中文 العربية',
  whitespaceString: '   leading and trailing   ',

  fullName: (): string => `QA Bot ${randomBytes(3).toString('hex')}`,
  phoneIN: (): string => `9${String(randomInt(100_000_000, 999_999_999))}`,
  postalCode: (): string => String(randomInt(10000, 99999)),
  appendText: (): string => ` and learning Playwright`,
  pastDate: (yearsAgo = 25): string => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - yearsAgo);
    d.setMonth(0, 15);
    return d.toISOString().slice(0, 10);
  },
  todayISO: (): string => new Date().toISOString().slice(0, 10),
  futureDate: (yearsAhead = 1): string => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + yearsAhead);
    return d.toISOString().slice(0, 10);
  },

  randomUser: () => ({
    firstName: `First${randomBytes(2).toString('hex')}`,
    lastName: `Last${randomBytes(2).toString('hex')}`,
    email: `qa+${randomBytes(3).toString('hex')}@example.com`,
    phone: `9${String(randomInt(100_000_000, 999_999_999))}`,
    addressLine1: '221B Baker Street',
    addressLine2: 'Apt 4',
    state: 'Greater London',
    postalCode: 'NW1 6XE',
    country: 'United Kingdom',
    countryCode: '44',
    dob: '1995-06-15',
    gender: 'Male' as const,
  }),
};

export const Selectors = {
  notch: '[disabled], [readonly]',
} as const;
