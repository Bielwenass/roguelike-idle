import { Application } from '@pixi/app';
import { Container } from '@pixi/display';
import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { itemFrameTint } from '../../../data/items/ItemFrameTint';
import {
  getItemIcon, textureUiInventoryBg, textureUiInventoryBorder,
} from '../Graphics';

import { Item } from '../../../types/Item';
import { ItemSprite } from '../../../types/ItemSprite';

import { centerOnScreen } from '../../../utils/centerOnScreen';

export function getInventoryBorder(position: Point) {
  const border = new Sprite(textureUiInventoryBorder);

  border.width = 10;
  border.height = 10;
  border.x = position.x;
  border.y = position.y;
  border.tint = 0x666666;

  return border;
}

export function addInventorySlots(count: number, parent: Container, position: Point): Sprite[] {
  let currentXPos = position.x;
  let currentYPos = position.y;

  const inventorySlots = Array(count).fill(null).map((_, slotIdx) => {
    const inventoryBorder = getInventoryBorder(new Point(currentXPos, currentYPos));

    currentXPos += 11;

    if ((slotIdx + 1) % 10 === 0) {
      currentYPos += 11;
      currentXPos -= 110;
    }

    return inventoryBorder;
  });

  parent.addChild(...inventorySlots);

  return inventorySlots;
}

export function initInventoryGui(): [Container, Sprite[]] {
  const inventoryGui = new Sprite(textureUiInventoryBg);

  inventoryGui.width = 595;
  inventoryGui.height = 210;
  inventoryGui.zIndex = 10;
  inventoryGui.visible = false;

  const inventorySlots = addInventorySlots(30, inventoryGui, new Point(5, 5));

  return [inventoryGui, inventorySlots];
}

export const [inventoryGui, inventorySlots] = initInventoryGui();

export function updateSlot(border: Sprite, newItem: Item | null, onClick?: Function): void {
  const oldItem = border.children[0] as ItemSprite;

  if (oldItem?.itemId === newItem?.id) {
    return;
  } if (!oldItem && !newItem) {
    return;
  }

  oldItem?.destroy();
  border.tint = 0x666666;

  if (newItem) {
    const itemSprite = new Sprite(getItemIcon(newItem.type)) as ItemSprite;

    itemSprite.position.x = 1;
    itemSprite.position.y = 1;

    itemSprite.itemId = newItem.id;

    if (onClick) {
      itemSprite.eventMode = 'static';

      itemSprite.on('click', () => {
        onClick(newItem);
      });
    }

    border.tint = itemFrameTint[newItem.rarity];
    border.addChild(itemSprite);
  }
}

export function updateBackpackGui(items: Item[]) {
  for (const [slotIdx, slot] of inventorySlots.entries()) {
    updateSlot(slot, items[slotIdx]);
  }
}

export function toggleInventoryGui() {
  inventoryGui.visible = !inventoryGui.visible;
}

export function enableResizeInventory(renderer: Application['renderer']) {
  renderer.on('resize', () => centerOnScreen(inventoryGui));
}
