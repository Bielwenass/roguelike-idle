import { Container } from '@pixi/display';
import { Point } from '@pixi/math';

import { InventorySlot } from './InventorySlot';
import { itemFrameTint } from '../../../data/items/ItemFrameTint';
import { itemStatStrings } from '../../../data/items/itemStatStrings';
import {
  equipItem, isEquipped, sellItem, unequipItem,
} from '../../Inventory';
import { drawText } from '../../Text';

import type { ItemSprite } from '../../../types/ItemSprite';

export class ItemPreview extends Container {
  constructor(itemSprite: ItemSprite) {
    super();
    this.x = 125;

    this.addChild(new InventorySlot(new Point(6, 6), itemSprite.item));

    const itemName = this.addChild(drawText(itemSprite.item.type, 'inventory'));

    itemName.scale = new Point(0.2, 0.2);
    itemName.style.fill = itemFrameTint[itemSprite.item.rarity];
    itemName.position = new Point(18, 7);

    const leftX = 6;
    const rightX = 42;
    let textY = 24;

    for (const statKey of (Object.keys(itemStatStrings) as (keyof typeof itemStatStrings)[])) {
      if (itemSprite.item[statKey]) {
        const { label } = itemStatStrings[statKey];

        const display = itemStatStrings[statKey].getValue(itemSprite.item[statKey]);

        const itemLabel = this.addChild(drawText(label, 'inventory', new Point(leftX, textY)));
        const itemDisplay = this.addChild(drawText(display, 'inventory', new Point(rightX, textY)));

        itemLabel.scale = new Point(0.2, 0.2);
        itemDisplay.scale = new Point(0.2, 0.2);

        textY += 6;
      }
    }

    if (isEquipped(itemSprite.item)) {
      const unequipButton = this.addChild(drawText(
        'Unequip',
        'inventory',
        new Point(leftX, 88),
        true,
      ));

      unequipButton.on('click', () => {
        unequipItem(itemSprite.item);
      });

      unequipButton.scale = new Point(0.2, 0.2);
      this.addChild(unequipButton);
    } else {
      const equipButton = this.addChild(drawText(
        'Equip',
        'inventory',
        new Point(leftX, 88),
        true,
      ));

      equipButton.on('click', () => {
        equipItem(itemSprite.item);
      });

      equipButton.scale = new Point(0.2, 0.2);

      // Can only sell an unequipped item
      const sellButton = this.addChild(drawText(
        `Sell for ${itemSprite.item.goldValue} coins`,
        'inventory',
        new Point(leftX, 96),
        true,
      ));

      sellButton.on('click', () => {
        sellItem(itemSprite.item);
      });

      sellButton.scale = new Point(0.2, 0.2);
      this.addChild(equipButton, sellButton);
    }
  }
}
