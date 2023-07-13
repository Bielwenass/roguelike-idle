import { ItemRarity } from '../enums/ItemRarity';

export const itemStatModByRarity: Map<ItemRarity, [number, number]> = new Map([
  [ItemRarity.Common, [1, 1.05]],
  [ItemRarity.Uncommon, [1.05, 1.12]],
  [ItemRarity.Rare, [1.12, 1.2]],
  [ItemRarity.Epic, [1.2, 1.35]],
  [ItemRarity.Legendary, [1.35, 1.7]],
]);
