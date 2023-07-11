import { ItemRarity } from '../data/enums/ItemRarity';
import { ItemType } from '../data/enums/ItemType';

export interface Item {
  type: ItemType,
  rarity: ItemRarity,
  level: number,
  goldValue: number,
}

export interface Weapon extends Item {
  attack: number,
  attackDelay: number,
}

export interface Armor extends Item {
  defense: number,
  speed: number,
}
