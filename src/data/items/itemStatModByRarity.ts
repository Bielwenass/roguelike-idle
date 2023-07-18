import { ItemRarity } from '../enums/ItemRarity';

export const itemStatModByRarity: Map<ItemRarity, [number, number]> = new Map([
  [ItemRarity.Common, [1, 1.05]],
  [ItemRarity.Uncommon, [1.1, 1.25]],
  [ItemRarity.Rare, [1.3, 1.45]],
  [ItemRarity.Epic, [1.45, 1.55]],
  [ItemRarity.Legendary, [1.6, 2]],
]);
