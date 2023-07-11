import { ItemRarity } from '../data/enums/ItemRarity';
import { ItemType } from '../data/enums/ItemType';

import { Item } from '../types/Item';

function rollRarity(diffMod: number): ItemRarity {
  const rarityNum = Math.random();
  let rarity = ItemRarity.Common;

  if (rarityNum < 0.003 * diffMod) {
    rarity = ItemRarity.Legendary;
  } else if (rarityNum < 0.015 * diffMod) {
    rarity = ItemRarity.Epic;
  } else if (rarityNum < 0.062 * diffMod) {
    rarity = ItemRarity.Rare;
  } else if (rarityNum < 0.25 * diffMod) {
    rarity = ItemRarity.Uncommon;
  }

  return rarity;
}

function rollType(): ItemType {
  return Math.random() > 0.5 ? ItemType.Armor : ItemType.Weapon;
}

export function rollItem(level: number, diffMod: number): Item {
  const itemRarity = rollRarity(diffMod);
  const itemType = rollType();

  return {
    type: itemType,
    rarity: itemRarity,
    level: 1,
    goldValue: 1,
  };
}
