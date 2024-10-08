import { Point } from 'pixi.js';

import { InventorySlot } from './InventorySlot';
import { StorageGui } from './StorageGui';
import { textures } from '../Graphics';

import type { Item } from '@type/Item';

export class EquipmentGui extends StorageGui {
  constructor(items: Item[]) {
    super(textures.uiInventoryEquip, new Point(210, 210), 80, new Point(14, 16), items);

    this.offset = new Point(-472, 0);
  }

  public override fillSlots(): void {
    const slotPositions = [
      new Point(5, 16),
      new Point(16, 5),
      new Point(16, 16),
      new Point(27, 16),
      new Point(16, 27),
    ];

    this.slots = slotPositions.map((pos) => this.addChild(new InventorySlot(pos)));
  }
}
