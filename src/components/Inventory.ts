import { calculateStats } from './Player';
import { state } from './State';
import { itemSlotByType } from '../data/items/itemSlotByType';

import { Item } from '../types/Item';

export function unequipItem(item: Item | null): void {
  if (!item) return;

  const slot = itemSlotByType[item.type];

  if (state.inventory.equipped[slot]) {
    // TODO: Change to vault once implemented
    state.inventory.temp.push(item);
    state.inventory.equipped[slot] = null;
  }
  state.player = calculateStats(state.player, state.inventory.equipped);
}

export function equipItem(item: Item): void {
  const slot = itemSlotByType[item.type];

  unequipItem(state.inventory.equipped[slot]);
  state.inventory.equipped[slot] = item;
  state.inventory.temp = state.inventory.temp.filter((e) => e.id !== item.id);
  state.player = calculateStats(state.player, state.inventory.equipped);
}
