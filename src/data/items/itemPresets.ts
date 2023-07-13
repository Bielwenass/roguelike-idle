import { ItemType } from '../enums/ItemType';

import { ItemBase } from '../../types/Item';

export const itemPresets: Record<ItemType, ItemBase> = {
  [ItemType.Dagger]: {
    attack: 1,
    attackDelay: 250,
    goldValue: 1,
  },
  [ItemType.Sword]: {
    attack: 4,
    attackDelay: 800,
    goldValue: 1,
  },
  [ItemType.Greatsword]: {
    attack: 12,
    attackDelay: 2000,
    goldValue: 1,
  },
  [ItemType.Helmet]: {
    defense: 4,
    speed: 1,
    goldValue: 1,
  },
  [ItemType.Chestplate]: {
    defense: 6,
    speed: 0,
    goldValue: 1,
  },
  [ItemType.Gloves]: {
    defense: 2,
    speed: 2,
    goldValue: 1,
  },
  [ItemType.Boots]: {
    defense: 2,
    speed: 3,
    goldValue: 1,
  },
};
