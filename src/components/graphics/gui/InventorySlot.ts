import { Sprite } from '@pixi/sprite';

import { itemFrameTint } from '../../../data/items/ItemFrameTint';
import { getItemIcon, textureUiInventoryBorder } from '../Graphics';

import type { Item } from '../../../types/Item';
import type { ItemSprite } from '../../../types/ItemSprite';

import type { Point } from '@pixi/math';

export class InventorySlot extends Sprite {
  public itemSprite: ItemSprite | null = null;

  public onClick: Function = Function.prototype;

  constructor(position: Point, item: Item | null = null) {
    super(textureUiInventoryBorder);

    this.width = 10;
    this.height = 10;
    this.tint = 0x666666;
    this.position = position;
    this.setItem(item);
  }

  public setItem(newItem: Item | null) {
    if (this.itemSprite?.item.id === newItem?.id) {
      return;
    } if (!this.itemSprite && !newItem) {
      return;
    }

    this.itemSprite?.destroy();
    this.itemSprite = null;
    this.tint = 0x666666;

    if (newItem) {
      const newItemSprite = new Sprite(getItemIcon(newItem.type)) as ItemSprite;

      newItemSprite.x = 1;
      newItemSprite.y = 1;

      newItemSprite.item = newItem;
      this.tint = itemFrameTint[newItem.rarity];
      newItemSprite.eventMode = 'static';

      newItemSprite.on('click', () => {
        this.onClick(newItemSprite);
      });

      this.itemSprite = newItemSprite;
      this.addChild(newItemSprite);
    }
  }

  public clearItem() {
    this.itemSprite = null;
  }
}
