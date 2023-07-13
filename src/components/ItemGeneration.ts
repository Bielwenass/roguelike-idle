import { state } from './State';
import { ItemRarity } from '../data/enums/ItemRarity';
import { ItemType } from '../data/enums/ItemType';
import { itemPresets } from '../data/items/itemPresets';
import { itemStatModByRarity } from '../data/items/itemStatModByRarity';

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

// Stat modifiers from rarity, 1.0 to 1.35
function getRarityMod(rarity: ItemRarity): number {
  const range = itemStatModByRarity.get(rarity)!;

  return range[0] + Math.random() * (range[1] - range[0]);
}

function rollStats(type: ItemType, rarity: ItemRarity, level: number): ItemBase {
  const item = {
    ...itemPresets[type],
  };

  if (item.attack) {
    item.attack = Math.floor(getRarityMod(rarity) * item.attack * 1.09 ** level);
  }
  if (item.defense) {
    item.defense = Math.floor(getRarityMod(rarity) * item.defense * 1.09 ** level);
  }
  if (item.speed) {
    item.speed = Math.floor(getRarityMod(rarity) * item.speed * 1.02 ** level);
  }

  item.goldValue *= Math.floor((level ** 1.1) * ((getRarityMod(rarity) - 1) * 20 + 1));

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
