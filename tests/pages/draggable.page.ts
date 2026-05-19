import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class DraggablePage extends BasePage {
  readonly url = Paths.draggable;

  get boundary(): Locator { return this.page.locator('.example-boundary'); }
  get draggable(): Locator { return this.page.locator('#sample-box'); }

  async dragBy(offsetX: number, offsetY: number): Promise<void> {
    const box = await this.draggable.boundingBox();
    if (!box) throw new Error('Draggable not visible');
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX + offsetX, startY + offsetY, { steps: 12 });
    await this.page.mouse.up();
  }

  async getDraggablePosition(): Promise<{ x: number; y: number }> {
    const box = await this.draggable.boundingBox();
    if (!box) throw new Error('Draggable not visible');
    return { x: box.x, y: box.y };
  }
}
