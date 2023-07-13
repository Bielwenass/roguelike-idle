import { state } from './State';
import { ItemRarity } from '../data/enums/ItemRarity';
import { ItemType } from '../data/enums/ItemType';
import { itemPresets } from '../data/items/itemPresets';

import { Item, ItemBase } from '../types/Item';

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

  if (typeNum < 0.1) {
    return ItemType.Dagger;
  } if (typeNum < 0.2) {
    return ItemType.Sword;
  } if (typeNum < 0.3) {
    return ItemType.Greatsword;
  } if (typeNum < 0.475) {
    return ItemType.Helmet;
  } if (typeNum < 0.65) {
    return ItemType.Chestplate;
  } if (typeNum < 0.825) {
    return ItemType.Gloves;
  }

  return ItemType.Boots;
}

function rollStats(type: ItemType, rarity: ItemRarity, level: number): ItemBase {
  const item = itemPresets[type];

  item.goldValue *= level * (1 + rarity / 2);

  return item;
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
    level,
    ...rollStats(itemType, itemRarity, level),
  };
}
