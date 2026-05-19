import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Paths } from '@helpers/paths';

export class DroppablePage extends BasePage {
  readonly url = Paths.droppable;

  get source(): Locator { return this.page.locator('#draggable'); }
  get target(): Locator { return this.page.locator('#droppable'); }

  async dragToTarget(): Promise<void> {
    await this.source.dragTo(this.target);
  }

  async manualDragToTarget(): Promise<void> {
    const sourceBox = await this.source.boundingBox();
    const targetBox = await this.target.boundingBox();
    if (!sourceBox || !targetBox) throw new Error('Drag elements not visible');
    const startX = sourceBox.x + sourceBox.width / 2;
    const startY = sourceBox.y + sourceBox.height / 2;
    const endX = targetBox.x + targetBox.width / 2;
    const endY = targetBox.y + targetBox.height / 2;
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX + 4, startY + 4, { steps: 5 });
    await this.page.mouse.move(startX + 10, startY + 10, { steps: 5 });
    await this.page.mouse.move(endX, endY, { steps: 30 });
    await this.page.mouse.move(endX, endY, { steps: 5 });
    await this.page.mouse.up();
    await this.page.waitForTimeout(300);
  }

  async targetContainsSource(): Promise<boolean> {
    return this.target.locator('#draggable').count().then((n) => n > 0);
  }

  async sourceCenterIsInsideTarget(): Promise<boolean> {
    if ((await this.source.count()) === 0) return false;
    const src = await this.source.boundingBox().catch(() => null);
    const tgt = await this.target.boundingBox().catch(() => null);
    if (!src || !tgt) return false;
    const cx = src.x + src.width / 2;
    const cy = src.y + src.height / 2;
    return cx >= tgt.x && cx <= tgt.x + tgt.width && cy >= tgt.y && cy <= tgt.y + tgt.height;
  }
}
