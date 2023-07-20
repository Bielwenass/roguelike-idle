import { ItemType } from '../enums/ItemType';

export const itemSlotByType: Record<ItemType, number> = {
  [ItemType.Dagger]: 0,
  [ItemType.Sword]: 0,
  [ItemType.Greatsword]: 0,
  [ItemType.Helmet]: 1,
  [ItemType.Chestplate]: 2,
  [ItemType.Gloves]: 3,
  [ItemType.Boots]: 4,
};
