import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { AbstractRenderer } from 'pixi.js';

import { itemFrameTint } from '../data/ItemFrameTint';
import { getScreenCenterX, getScreenCenterY } from './Camera';
import { getItemIcon, initGraphics } from './Graphics';

import { Item } from '../types/Item';

// TODO: Standardize texture usage
const {
  textureUiInventoryBg,
  textureUiInventoryBorder,
} = initGraphics();

const gui = new Container();
const inventory = new Sprite(textureUiInventoryBg);
const GUI_WIDTH = 714;
const GUI_HEIGHT = 252;

function centerInventory(): void {
  inventory.x = getScreenCenterX() - GUI_WIDTH / 2;
  inventory.y = getScreenCenterY() - GUI_HEIGHT / 2;
}

inventory.width = GUI_WIDTH;
inventory.height = GUI_HEIGHT;
inventory.zIndex = 10;
inventory.visible = false;

centerInventory();

let currentXPos = 5;
let currentYPos = 5;

const inventorySlots = Array(30).fill(null).map((_, slotIdx) => {
  const inventoryBorder = new Sprite(textureUiInventoryBorder);

  inventoryBorder.width = 10;
  inventoryBorder.height = 10;
  inventoryBorder.x = currentXPos;
  inventoryBorder.y = currentYPos;
  inventoryBorder.tint = 0x666666;

  currentXPos += 11;

  if ((slotIdx + 1) % 10 === 0) {
    currentYPos += 11;
    currentXPos -= 110;
  }

  return inventoryBorder;
});

inventory.addChild(...inventorySlots);
gui.addChild(inventory);

export function enableResizeGui(renderer: AbstractRenderer) {
  renderer.on('resize', () => centerInventory());
}

export function getGui(): Container {
  return gui;
}

export function updateGui(items: Item[]) {
  for (const [slotIdx, slot] of inventorySlots.entries()) {
    if (!slot.children[0] && items[slotIdx]) {
      // TODO: Add icons by item type
      const itemSprite = new Sprite(getItemIcon()) as ItemSprite;

      itemSprite.position.x = 1;
      itemSprite.position.y = 1;
      slot.tint = itemFrameTint[items[slotIdx].rarity];

      itemSprite.inventoryIdx = slotIdx;
      slot.addChild(itemSprite);
    } else if (!items[slotIdx]) {
      slot.tint = 0x666666;
    }
    // if (inventorySlots[itemIdx].children.length && inventorySlots[itemIdx].children)
  }
}

export function toggleInventoryDisplay() {
  inventory.visible = !inventory.visible;
}

interface ItemSprite extends Sprite {
  inventoryIdx: number
}
