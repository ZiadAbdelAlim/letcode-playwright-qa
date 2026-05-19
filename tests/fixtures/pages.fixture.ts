import { test as base } from '@playwright/test';
import { EditPage } from '@pages/edit.page';
import { ButtonsPage } from '@pages/buttons.page';
import { DropdownsPage } from '@pages/dropdowns.page';
import { AlertPage } from '@pages/alert.page';
import { FramePage } from '@pages/frame.page';
import { RadioPage } from '@pages/radio.page';
import { WindowPage } from '@pages/window.page';
import { ElementsPage } from '@pages/elements.page';
import { DraggablePage } from '@pages/draggable.page';
import { DroppablePage } from '@pages/droppable.page';
import { SortablePage } from '@pages/sortable.page';
import { SelectablePage } from '@pages/selectable.page';
import { SliderPage } from '@pages/slider.page';
import { WaitsPage } from '@pages/waits.page';
import { TablePage } from '@pages/table.page';
import { AdvancedTablePage } from '@pages/advanced-table.page';
import { CalendarPage } from '@pages/calendar.page';
import { FormsPage } from '@pages/forms.page';
import { FilePage } from '@pages/file.page';
import { ShadowPage } from '@pages/shadow.page';
import { ProductsPage } from '@pages/products.page';
import { TestIndexPage } from '@pages/test-index.page';

type Pages = {
  editPage: EditPage;
  buttonsPage: ButtonsPage;
  dropdownsPage: DropdownsPage;
  alertPage: AlertPage;
  framePage: FramePage;
  radioPage: RadioPage;
  windowPage: WindowPage;
  elementsPage: ElementsPage;
  draggablePage: DraggablePage;
  droppablePage: DroppablePage;
  sortablePage: SortablePage;
  selectablePage: SelectablePage;
  sliderPage: SliderPage;
  waitsPage: WaitsPage;
  tablePage: TablePage;
  advancedTablePage: AdvancedTablePage;
  calendarPage: CalendarPage;
  formsPage: FormsPage;
  filePage: FilePage;
  shadowPage: ShadowPage;
  productsPage: ProductsPage;
  testIndexPage: TestIndexPage;
};

export const test = base.extend<Pages>({
  editPage: async ({ page }, use) => { await use(new EditPage(page)); },
  buttonsPage: async ({ page }, use) => { await use(new ButtonsPage(page)); },
  dropdownsPage: async ({ page }, use) => { await use(new DropdownsPage(page)); },
  alertPage: async ({ page }, use) => { await use(new AlertPage(page)); },
  framePage: async ({ page }, use) => { await use(new FramePage(page)); },
  radioPage: async ({ page }, use) => { await use(new RadioPage(page)); },
  windowPage: async ({ page }, use) => { await use(new WindowPage(page)); },
  elementsPage: async ({ page }, use) => { await use(new ElementsPage(page)); },
  draggablePage: async ({ page }, use) => { await use(new DraggablePage(page)); },
  droppablePage: async ({ page }, use) => { await use(new DroppablePage(page)); },
  sortablePage: async ({ page }, use) => { await use(new SortablePage(page)); },
  selectablePage: async ({ page }, use) => { await use(new SelectablePage(page)); },
  sliderPage: async ({ page }, use) => { await use(new SliderPage(page)); },
  waitsPage: async ({ page }, use) => { await use(new WaitsPage(page)); },
  tablePage: async ({ page }, use) => { await use(new TablePage(page)); },
  advancedTablePage: async ({ page }, use) => { await use(new AdvancedTablePage(page)); },
  calendarPage: async ({ page }, use) => { await use(new CalendarPage(page)); },
  formsPage: async ({ page }, use) => { await use(new FormsPage(page)); },
  filePage: async ({ page }, use) => { await use(new FilePage(page)); },
  shadowPage: async ({ page }, use) => { await use(new ShadowPage(page)); },
  productsPage: async ({ page }, use) => { await use(new ProductsPage(page)); },
  testIndexPage: async ({ page }, use) => { await use(new TestIndexPage(page)); },
});

export { expect } from '@playwright/test';
