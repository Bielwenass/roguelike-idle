import type { ItemRarity } from '../data/enums/ItemRarity';
import type { ItemType } from '../data/enums/ItemType';

export type ItemBase = {
  attack?: number,
  attackDelay?: number,
  defense?: number,
  speed?: number,
  goldValue: number,
};

export type Item = ItemBase & {
  id: number,
  name: string,
  type: ItemType,
  rarity: ItemRarity,
  level: number,
};
