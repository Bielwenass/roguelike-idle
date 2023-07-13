import { ItemType } from '../enums/ItemType';

import { ItemBase } from '../../types/Item';

export const itemPresets: Record<ItemType, ItemBase> = {
  [ItemType.Dagger]: {
    attack: 1,
    attackDelay: 250,
    goldValue: 5,
  },
  [ItemType.Sword]: {
    attack: 4,
    attackDelay: 800,
    goldValue: 5,
  },
  [ItemType.Greatsword]: {
    attack: 12,
    attackDelay: 2000,
    goldValue: 5,
  },
  [ItemType.Helmet]: {
    defense: 4,
    speed: 1,
    goldValue: 4,
  },
  [ItemType.Chestplate]: {
    defense: 6,
    speed: 0,
    goldValue: 6,
  },
  [ItemType.Gloves]: {
    defense: 2,
    speed: 2,
    goldValue: 4,
  },
  [ItemType.Boots]: {
    defense: 2,
    speed: 3,
    goldValue: 4,
  },
};
