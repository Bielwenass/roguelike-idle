import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { Application, Point } from 'pixi.js';

import { getScreenCenterX, getScreenCenterY } from './Camera';
// TODO: Standardize texture usage
import {
  getItemIcon,
  textureUiInventoryBg,
  textureUiInventoryBorder,
  textureUiInventoryEquip,
} from './Graphics';
import { equipItem, unequipItem } from './Inventory';
import { state } from './State';
import { ItemSlot } from '../data/enums/ItemSlot';
import { itemFrameTint } from '../data/items/ItemFrameTint';

import { EquippedItems } from '../types/EquippedItems';
import { Item } from '../types/Item';

type EquipmentGui = Sprite & {
  [key in ItemSlot]: Sprite
};

interface ItemSprite extends Sprite {
  itemId: number;
}

const gui = new Container();
const inventoryGui = new Sprite(textureUiInventoryBg);
const GUI_WIDTH = 714;
const GUI_HEIGHT = 252;

function centerInventory(): void {
  inventoryGui.x = getScreenCenterX() - GUI_WIDTH / 2;
  inventoryGui.y = getScreenCenterY() - GUI_HEIGHT / 2;
}

inventoryGui.width = GUI_WIDTH;
inventoryGui.height = GUI_HEIGHT;
inventoryGui.zIndex = 10;
inventoryGui.visible = false;

centerInventory();

let currentXPos = 5;
let currentYPos = 5;

function getInventoryBorder(position: Point) {
  const border = new Sprite(textureUiInventoryBorder);

  border.width = 10;
  border.height = 10;
  border.x = position.x;
  border.y = position.y;
  border.tint = 0x666666;

  return border;
}

const inventorySlots = Array(30).fill(null).map((_, slotIdx) => {
  const inventoryBorder = getInventoryBorder(new Point(currentXPos, currentYPos));

  currentXPos += 11;

  if ((slotIdx + 1) % 10 === 0) {
    currentYPos += 11;
    currentXPos -= 110;
  }

  return inventoryBorder;
});

function initEquipmentGui() {
  const equipmentGui = new Sprite(textureUiInventoryEquip) as EquipmentGui;

  equipmentGui.width = 42;
  equipmentGui.height = 42;
  equipmentGui.x = inventoryGui.x - 90;

  equipmentGui[ItemSlot.Weapon] = equipmentGui.addChild(getInventoryBorder(new Point(5, 16)));
  equipmentGui[ItemSlot.Helmet] = equipmentGui.addChild(getInventoryBorder(new Point(16, 5)));
  equipmentGui[ItemSlot.Chestplate] = equipmentGui.addChild(getInventoryBorder(new Point(16, 16)));
  equipmentGui[ItemSlot.Gloves] = equipmentGui.addChild(getInventoryBorder(new Point(27, 16)));
  equipmentGui[ItemSlot.Boots] = equipmentGui.addChild(getInventoryBorder(new Point(16, 27)));

  return equipmentGui;
}

const equipmentGui = inventoryGui.addChild(initEquipmentGui());

inventoryGui.addChild(...inventorySlots);
gui.addChild(inventoryGui);

function updateSlot(border: Sprite, newItem: Item | null, isEquipped: boolean): void {
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
    itemSprite.interactive = true;
    itemSprite.itemId = newItem.id;

    itemSprite.on('click', () => {
      if (isEquipped) {
        unequipItem(newItem);
      } else {
        equipItem(newItem);
      }

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      updateTempInventory(state.inventory.temp);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      updateEquipment(state.inventory.equipped);
    });

    border.tint = itemFrameTint[newItem.rarity];
    border.addChild(itemSprite);
  }
}

export function updateTempInventory(items: Item[]) {
  for (const [slotIdx, slot] of inventorySlots.entries()) {
    updateSlot(slot, items[slotIdx], false);
  }
}

export function updateEquipment(
  equipment: EquippedItems,
) {
  for (const [slot, item] of Object.entries(equipment)) {
    updateSlot(equipmentGui[slot as keyof typeof ItemSlot], item, true);
  }
}

export function toggleInventoryDisplay() {
  inventoryGui.visible = !inventoryGui.visible;
}

export function enableResizeGui(renderer: Application['renderer']) {
  renderer.on('resize', () => centerInventory());
}

export function getGui(): Container {
  return gui;
}
