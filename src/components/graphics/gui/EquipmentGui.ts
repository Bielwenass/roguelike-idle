import { Application } from '@pixi/app';
import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { getInventoryBorder, updateSlot } from './InventoryGui';
import { ItemSlot } from '../../../data/enums/ItemSlot';
import { textureUiInventoryEquip } from '../Graphics';

import { EquippedItems } from '../../../types/EquippedItems';

import { centerOnScreen } from '../../../utils/centerOnScreen';

type EquipmentGui = Sprite & {
  [key in ItemSlot]: Sprite
};

function initEquipmentGui() {
  const equipmentGui = new Sprite(textureUiInventoryEquip) as EquipmentGui;

  equipmentGui.width = 210;
  equipmentGui.height = 210;
  equipmentGui.zIndex = 10;
  equipmentGui.visible = false;

  equipmentGui[ItemSlot.Weapon] = equipmentGui.addChild(getInventoryBorder(new Point(5, 16)));
  equipmentGui[ItemSlot.Helmet] = equipmentGui.addChild(getInventoryBorder(new Point(16, 5)));
  equipmentGui[ItemSlot.Chestplate] = equipmentGui.addChild(getInventoryBorder(new Point(16, 16)));
  equipmentGui[ItemSlot.Gloves] = equipmentGui.addChild(getInventoryBorder(new Point(27, 16)));
  equipmentGui[ItemSlot.Boots] = equipmentGui.addChild(getInventoryBorder(new Point(16, 27)));

  return equipmentGui;
}

export const equipmentGui = initEquipmentGui();

export function toggleEquipmentGui(flag?: boolean) {
  equipmentGui.visible = flag ?? !equipmentGui.visible;
}

export function updateEquipmentGui(
  equipment: EquippedItems,
) {
  for (const [slot, item] of Object.entries(equipment)) {
    updateSlot(equipmentGui[slot as keyof typeof ItemSlot], item);
  }
}

export function enableResizeEquipment(renderer: Application['renderer']) {
  renderer.on('resize', () => centerOnScreen(equipmentGui, new Point(-472, 0)));
}
