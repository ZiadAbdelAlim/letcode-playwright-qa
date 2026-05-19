# LetCode Automation Suite

Playwright + TypeScript automation suite for every practice exercise on
[https://letcode.in/test](https://letcode.in/test). Built around the Page Object Model with
typed fixtures, a single source of truth for selectors per page, and comprehensive positive +
negative coverage.

## What's covered

All **21 practice examples** plus the `/test` landing page (22 total feature folders):

| # | Example | Path | Spec |
|---|---|---|---|
| 0 | Test index / landing | `/test` | `tests/specs/test-index` |
| 1 | Page Object Model practice (Fake Store) | `/home` | `tests/specs/products` |
| 2 | Input fields | `/edit` | `tests/specs/edit` |
| 3 | Buttons | `/buttons` | `tests/specs/buttons` |
| 4 | Dropdowns | `/dropdowns` | `tests/specs/dropdowns` |
| 5 | Alerts & dialogs | `/alert` | `tests/specs/alert` |
| 6 | Frames / iframes | `/frame` | `tests/specs/frame` |
| 7 | Radio & checkbox | `/radio` | `tests/specs/radio` |
| 8 | Windows / tabs | `/window` | `tests/specs/window` |
| 9 | Find elements | `/elements` | `tests/specs/elements` |
| 10 | Drag (AUI-1) | `/draggable` | `tests/specs/drag-drop` |
| 11 | Drop (AUI-2) | `/droppable` | `tests/specs/drag-drop` |
| 12 | Sortable (AUI-3) | `/sortable` | `tests/specs/sortable` |
| 13 | Multi-select (AUI-4) | `/selectable` | `tests/specs/selectable` |
| 14 | Slider (AUI-5) | `/slider` | `tests/specs/slider` |
| 15 | Waits | `/waits` | `tests/specs/waits` |
| 16 | Simple table | `/table` | `tests/specs/table` |
| 17 | Advanced table | `/advancedtable` | `tests/specs/advanced-table` |
| 18 | Calendar / date picker | `/calendar` | `tests/specs/calendar` |
| 19 | Forms (full submission) | `/forms` | `tests/specs/forms` |
| 20 | File upload / download | `/file` | `tests/specs/file` |
| 21 | Shadow DOM | `/shadow` | `tests/specs/shadow` |

Each spec exercises happy-path, validation, boundary, and negative scenarios
(disabled state, readonly, XSS, SQL injection, long inputs, empty inputs, out-of-range
values, multi-tab handling, etc.).

## Setup

```powershell
npm install
npx playwright install        # or: npx playwright install chromium
```

> If you hit `UNABLE_TO_VERIFY_LEAF_SIGNATURE` on a corporate network, prefix commands with
> `$env:NODE_OPTIONS = "--use-system-ca"` (PowerShell) or `NODE_OPTIONS=--use-system-ca` (bash).

## Running tests

```powershell
npm test                       # all configured browsers
npm run test:chrome            # chromium only — fastest local loop
npm run test:firefox
npm run test:webkit
npm run test:headed            # watch the browser
npm run test:ui                # Playwright UI mode
npm run test:debug             # step through a test
npm run test:report            # open the last HTML report

# Run a single feature
npx playwright test tests/specs/forms --project=chromium
```

## Project structure

```
tests/
  pages/                       # One Page Object per page; selectors live here only
    base.page.ts               # Shared abstract base (goto, page-load, scroll, asserts)
    edit.page.ts, buttons.page.ts, dropdowns.page.ts, ...
  fixtures/
    pages.fixture.ts           # Custom test extends with all page objects
    uploads/                   # Generated upload fixtures (text/binary samples)
  helpers/
    paths.ts                   # Single source of truth for URL paths
    test-data.factory.ts       # Random users, edge-case strings (XSS, SQLi, emoji, long)
    file-fixtures.ts           # Bootstraps files for upload tests
  specs/
    <feature>/<feature>.spec.ts  # Mirrors pages/ — easy to navigate
playwright.config.ts           # 5 browser projects, HTML+JSON+list reporters
tsconfig.json                  # `@pages/*`, `@fixtures/*`, `@helpers/*` path aliases
```

## Design conventions

- **Selectors only in Page Objects.** Specs never call `page.locator()` directly; they
  ask the POM for an action or a locator.
- **Lazy locators.** Page Object `get` properties return Locators without `await`, so
  callers can chain or assert without rebuild costs.
- **Single source of paths.** `Paths.edit`, `Paths.dropdowns` etc. – rename a route in
  one place.
- **Custom fixture extends `test`.** Specs import `{ test, expect }` from
  `@fixtures/pages.fixture` and request only the page objects they use.
- **Negative scenarios are first-class.** Every spec includes failure / edge-case
  scenarios alongside the happy path (XSS, long strings, disabled / readonly,
  out-of-range sliders, invalid emails, drag boundaries, etc.).
- **Known bugs documented as tests.** Two LetCode-side bugs are pinned by tests labelled
  `BUG:` so we'd notice if the upstream fix lands:
  1. Sortable table's column sort is one-shot (re-clicking the same header doesn't
     reverse, and clicking a different header doesn't re-sort).
  2. The "Find the bug" radio group uses two different `name` attributes, so both can
     be selected at once.

## Latest run

`npm run test:chrome` → **154 passed**, 4 conditionally skipped (GitHub-API-dependent
spec and DataTables-dependent advanced-table specs), 0 failed. ~57s on Chromium.

## Adding a new page

1. Create `tests/pages/<name>.page.ts` extending `BasePage` with `readonly url` and
   typed Locator getters.
2. Add the URL constant to `tests/helpers/paths.ts`.
3. Register the page in `tests/fixtures/pages.fixture.ts`.
4. Write the spec under `tests/specs/<name>/<name>.spec.ts`.
