import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class SortablePage extends BasePage {
  readonly url = Paths.sortable;

  get todoList(): Locator { return this.page.locator('#cdk-drop-list-0'); }
  get doneList(): Locator { return this.page.locator('#cdk-drop-list-1'); }

  get todoItems(): Locator { return this.todoList.locator('.cdk-drag'); }
  get doneItems(): Locator { return this.doneList.locator('.cdk-drag'); }

  async moveItemFromTodoToDone(itemText: string): Promise<void> {
    const item = this.todoList.locator('.cdk-drag', { hasText: itemText });
    await this.cdkDrag(item, this.doneList);
  }

  private async cdkDrag(source: import('@playwright/test').Locator, target: import('@playwright/test').Locator): Promise<void> {
    const src = await source.boundingBox();
    const tgt = await target.boundingBox();
    if (!src || !tgt) throw new Error('Cannot drag — element bounding box missing');
    const sx = src.x + src.width / 2;
    const sy = src.y + src.height / 2;
    const tx = tgt.x + tgt.width / 2;
    const ty = tgt.y + tgt.height / 2;
    await this.page.mouse.move(sx, sy);
    await this.page.mouse.down();
    await this.page.mouse.move(sx + 5, sy + 5, { steps: 5 });
    await this.page.mouse.move(tx, ty, { steps: 25 });
    await this.page.mouse.move(tx, ty, { steps: 5 });
    await this.page.mouse.up();
    await this.page.waitForTimeout(200);
  }

  async moveAllTodosToDone(): Promise<void> {
    let texts = (await this.todoItems.allTextContents()).map((t) => t.trim()).filter(Boolean);
    while (texts.length > 0) {
      await this.moveItemFromTodoToDone(texts[0]);
      texts = (await this.todoItems.allTextContents()).map((t) => t.trim()).filter(Boolean);
    }
  }

  async getTodoTexts(): Promise<string[]> {
    return (await this.todoItems.allTextContents()).map((t) => t.trim());
  }

  async getDoneTexts(): Promise<string[]> {
    return (await this.doneItems.allTextContents()).map((t) => t.trim());
  }
}
