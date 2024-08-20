import { itemFrameTint } from '@data/items/ItemFrameTint';
import {
  Container, Sprite, type Point,
} from 'pixi.js';

import { getItemIcon, textureUiInventoryBorder } from '../Graphics';

import type { Item } from '@type/Item';
import type { ItemSprite } from '@type/ItemSprite';

export class InventorySlot extends Container {
  public itemSprite: ItemSprite | null = null;

  private itemBorder: Sprite;

  constructor(position: Point, item: Item | null = null) {
    super(textureUiInventoryBorder);

    const borderSprite = new Sprite(textureUiInventoryBorder);

    borderSprite.width = 10;
    borderSprite.height = 10;
    borderSprite.tint = 0x666666;

    this.position = position;
    this.itemBorder = this.addChild(borderSprite);
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
    this.itemBorder.tint = 0x666666;
    this.eventMode = 'none';

    if (newItem) {
      const newItemSprite = new Sprite(getItemIcon(newItem.type)) as ItemSprite;

      newItemSprite.x = 1;
      newItemSprite.y = 1;
      newItemSprite.item = newItem;

      this.itemBorder.tint = itemFrameTint[newItem.rarity];
      this.itemSprite = this.addChild(newItemSprite);

      this.eventMode = 'static';
    }
  }

  public clearItem() {
    this.itemSprite = null;
  }
}
