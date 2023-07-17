import { Application } from '@pixi/app';
import { Container } from '@pixi/display';
import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';
import { Text } from '@pixi/text';

import { updateEquipmentGui } from './EquipmentGui';
import {
  addInventorySlots, getInventoryBorder, updateSlot,
} from './InventoryGui';
import { itemFrameTint } from '../../../data/items/ItemFrameTint';
import { itemSort } from '../../../data/items/itemSort';
import { itemStatStrings } from '../../../data/items/itemStatStrings';
import { equipItem, sellItem } from '../../Inventory';
import { state } from '../../State';
import { drawText } from '../../Text';
import { textureUiVaultBg } from '../Graphics';

import { Item } from '../../../types/Item';

import { centerOnScreen } from '../../../utils/centerOnScreen';

interface VaultGui extends Sprite {
  slots: Sprite[],
  preview: Container,
  sortLabels: Text[],
}

export function initVaultGui(): VaultGui {
  const vaultGui = new Sprite(textureUiVaultBg) as VaultGui;

  vaultGui.width = 960;
  vaultGui.height = 540;
  vaultGui.zIndex = 10;
  vaultGui.visible = false;

  const vaultSlots = addInventorySlots(80, vaultGui, new Point(14, 16));

  vaultGui.slots = vaultSlots;

  return vaultGui;
}

export const vaultGui = initVaultGui();

export function updateVaultGui(items: Item[]) {
  for (const [slotIdx, slot] of vaultGui.slots.entries()) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    updateSlot(slot, items[slotIdx], updatePreviewItem);
  }
}

function initSortLabels(): Text[] {
  let labelX = 12;

  const labels = itemSort.map((sortData) => {
    const text = drawText(sortData.label, 'inventory', new Point(labelX, 3), true);
    const textOffset = 6 - text.width / 2 / 5;

    text.x += textOffset;
    text.scale = new Point(0.2, 0.2);
    labelX += 13;

    text.on('click', () => {
      updateVaultGui(state.inventory.vault.toSorted(sortData.comparison));
    });

    return text;
  });

  return labels;
}

vaultGui.sortLabels = initSortLabels();
vaultGui.addChild(...vaultGui.sortLabels);

function clearPreviewItem() {
  vaultGui.preview?.destroy();
  vaultGui.preview = vaultGui.addChild(new Container());
  vaultGui.preview.x = 125;
}

export function toggleVaultGui(flag?: boolean) {
  vaultGui.visible = flag ?? !vaultGui.visible;
  clearPreviewItem();
}

function updatePreviewItem(item: Item) {
  clearPreviewItem();
  const border = getInventoryBorder(new Point(6, 6));

  updateSlot(border, item);
  vaultGui.preview.addChild(border);

  const itemName = vaultGui.preview.addChild(drawText(item.type, 'inventory'));

  itemName.scale = new Point(0.2, 0.2);
  itemName.style.fill = itemFrameTint[item.rarity];
  itemName.position = new Point(18, 7);

  const leftX = 6;
  const rightX = 42;
  let textY = 24;

  for (const statKey of Object.keys(itemStatStrings)) {
    if (item[statKey as keyof Item]) {
      const { label } = itemStatStrings[statKey as keyof typeof itemStatStrings];
      const display = itemStatStrings[statKey as keyof typeof itemStatStrings]
        .getValue(item[statKey as keyof Item]);

      const itemLabel = vaultGui.preview.addChild(drawText(label, 'inventory', new Point(leftX, textY)));
      const itemDisplay = vaultGui.preview.addChild(drawText(display, 'inventory', new Point(rightX, textY)));

      itemLabel.scale = new Point(0.2, 0.2);
      itemDisplay.scale = new Point(0.2, 0.2);

      textY += 6;
    }
  }

  const equipButton = vaultGui.preview.addChild(drawText(
    'Equip',
    'inventory',
    new Point(leftX, 88),
    true,
  ));

  equipButton.on('click', () => {
    equipItem(item);
    updateVaultGui(state.inventory.vault);
    updateEquipmentGui(state.inventory.equipped);
  });

  const sellButton = vaultGui.preview.addChild(drawText(
    `Sell for ${item.goldValue} coins`,
    'inventory',
    new Point(leftX, 96),
    true,
  ));

  sellButton.on('click', () => {
    sellItem(item);
    updateVaultGui(state.inventory.vault);
    clearPreviewItem();
  });

  equipButton.scale = new Point(0.2, 0.2);
  sellButton.scale = new Point(0.2, 0.2);
  vaultGui.preview.addChild(equipButton, sellButton);
}

export function enableResizeVault(renderer: Application['renderer']) {
  renderer.on('resize', () => centerOnScreen(vaultGui, new Point(128, 0)));
}
