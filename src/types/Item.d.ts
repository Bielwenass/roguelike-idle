import { ItemRarity } from '../data/enums/ItemRarity';
import { ItemType } from '../data/enums/ItemType';

export interface ItemBase {
  attack?: number,
  attackDelay?: number,
  defense?: number,
  speed?: number,
  goldValue: number,
}

export interface Item extends ItemBase {
  id: number,
  type: ItemType,
  rarity: ItemRarity,
  level: number,
}
