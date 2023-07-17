import { calculateStats } from './Player';
import { state } from './State';
import { itemSlotByType } from '../data/items/itemSlotByType';

import { Item } from '../types/Item';

export function unequipItem(item: Item | null): void {
  if (!item) return;

  const slot = itemSlotByType[item.type];

  if (state.inventory.equipped[slot]) {
    state.inventory.vault.push(item);
    state.inventory.equipped[slot] = null;
  }
  state.player = calculateStats(state.player, state.inventory.equipped);
}

export function equipItem(item: Item): void {
  const slot = itemSlotByType[item.type];

  unequipItem(state.inventory.equipped[slot]);
  state.inventory.equipped[slot] = item;
  // TODO: Optimize
  state.inventory.vault = state.inventory.vault.filter((e) => e.id !== item.id);
  state.player = calculateStats(state.player, state.inventory.equipped);
}

export function stashToVault(): Item[] {
  const itemsToStash = state.inventory.backpack;

  state.inventory.vault.push(...itemsToStash);
  state.inventory.backpack = [];

  return itemsToStash;
}

export function sellItem(item: Item): void {
  // TODO: Optimize
  state.inventory.vault = state.inventory.vault.filter((e) => e.id !== item.id);

  state.inventory.gold += item.goldValue;
}
