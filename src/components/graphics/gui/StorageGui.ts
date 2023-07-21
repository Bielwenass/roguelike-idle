import { Point } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { centerOnScreen } from '@utils/centerOnScreen';

import { InventorySlot } from './InventorySlot';
import { SelectedSlot } from './SelectedSlot';

import type { Application } from '@pixi/app';
import type { Texture } from '@pixi/core';
import type { Item } from '@type/Item';

export class StorageGui extends Sprite {
  protected slots: ReadonlyArray<InventorySlot> = [];

  protected content: ReadonlyArray<Item>;

  protected offset: Point = new Point(0, 0);

  public constructor(texture: Texture, size: Point, slotsCount: number, slotsPosition: Point, items: Item[]) {
    super(texture);
    this.width = size.x;
    this.height = size.y;
    this.visible = false;
    this.content = items;
    this.fillSlots(slotsCount, slotsPosition);
  }

  protected fillSlots(count: number, position: Point): void {
    const currentPosition = position.clone();

    this.slots = Array.from({
      length: count,
    }).map((_, idx) => {
      const newSlot = new InventorySlot(currentPosition);

      currentPosition.x += 11;

      if ((idx + 1) % 10 === 0) {
        currentPosition.y += 11;
        currentPosition.x -= 110;
      }

      this.addChild(newSlot);

      return newSlot;
    });
  }

  public updateSlots(): void {
    for (const [slotIdx, slot] of this.slots.entries()) {
      slot.onClick = () => {
        SelectedSlot.select(slot);
      };
      slot.setItem(this.content[slotIdx]);
    }
  }

  public toggle(flag?: boolean): void {
    this.visible = flag ?? !this.visible;
  }

  public enableResize(renderer: Application['renderer']): void {
    centerOnScreen(this, this.offset);
    renderer.on('resize', () => centerOnScreen(this, this.offset));
  }
}
