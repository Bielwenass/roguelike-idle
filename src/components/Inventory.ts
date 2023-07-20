import { Gui } from './graphics/gui/Gui';
import { SelectedSlot } from './graphics/gui/SelectedSlot';
import { calculateStats } from './Player';
import { state } from './State';
import { itemSlotByType } from '../data/items/itemSlotByType';

import type { Item } from '../types/Item';

export function addItem(item: Item): void {
  // TODO: Limit inventory sizes
  state.inventory.backpack.push(item);
  Gui.backpack.updateSlots();
}

export function isEquipped(item: Item): boolean {
  return state.inventory.equipped[itemSlotByType[item.type]] === item;
}

export function unequipItem(item: Item | null): void {
  if (!item) return;

  if (isEquipped(item)) {
    const slot = itemSlotByType[item.type];

    state.inventory.vault.push(item);
    state.inventory.equipped[slot] = null;
    Gui.vault.updateSlots();
    Gui.equipment.updateSlots();
    state.player = calculateStats(state.player, state.inventory.equipped);
  }
}

export function equipItem(item: Item): void {
  const vaultIdx = state.inventory.vault.indexOf(item);

  if (vaultIdx >= 0) {
    const slot = itemSlotByType[item.type];

    unequipItem(state.inventory.equipped[slot]);
    state.inventory.equipped[slot] = item;

    state.inventory.vault.splice(state.inventory.vault.indexOf(item), 1);

    Gui.vault.updateSlots();
    Gui.equipment.updateSlots();
    SelectedSlot.update();

    state.player = calculateStats(state.player, state.inventory.equipped);
  }
}

export function stashToVault(): Item[] {
  const itemsToStash = state.inventory.backpack;

  state.inventory.vault.push(...itemsToStash);
  state.inventory.backpack = [];
  Gui.backpack.updateSlots();
  Gui.vault.updateSlots();

  return itemsToStash;
}

export function sellItem(item: Item): void {
  const vaultIdx = state.inventory.vault.indexOf(item);

  if (vaultIdx >= 0) {
    state.inventory.vault.splice(state.inventory.vault.indexOf(item), 1);

    state.inventory.gold += item.goldValue;
    Gui.vault.updateSlots();
    SelectedSlot.update();
  }
}
