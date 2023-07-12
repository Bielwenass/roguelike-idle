import { ItemRarity } from '../data/enums/ItemRarity';
import { ItemType } from '../data/enums/ItemType';
import { state } from './State';

import { Item } from '../types/Item';

function rollRarity(diffMod: number): ItemRarity {
  const rarityNum = Math.random();

  if (rarityNum < 0.003 * diffMod) {
    return ItemRarity.Legendary;
  } if (rarityNum < 0.015 * diffMod) {
    return ItemRarity.Epic;
  } if (rarityNum < 0.062 * diffMod) {
    return ItemRarity.Rare;
  } if (rarityNum < 0.25 * diffMod) {
    return ItemRarity.Uncommon;
  }

  return ItemRarity.Common;
}

function rollType(): ItemType {
  const typeNum = Math.random();

  if (typeNum < 0.2) {
    return ItemType.Sword;
  } if (typeNum < 0.4) {
    return ItemType.Helmet;
  } if (typeNum < 0.6) {
    return ItemType.Chestplate;
  } if (typeNum < 0.8) {
    return ItemType.Gloves;
  }

  return ItemType.Boots;
}

export function rollItem(level: number, diffMod: number): Item {
  const itemRarity = rollRarity(diffMod);
  const itemType = rollType();
  const id = state.meta.lastItemId + 1;

  state.meta.lastItemId += 1;

  return {
    id,
    type: itemType,
    rarity: itemRarity,
    level: 1,
    goldValue: 1,
  };
}
