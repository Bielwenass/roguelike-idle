import { ItemSlot } from '../enums/ItemSlot';
import { ItemType } from '../enums/ItemType';

export const itemSlotByType: Record<ItemType, ItemSlot> = {
  [ItemType.Dagger]: ItemSlot.Weapon,
  [ItemType.Sword]: ItemSlot.Weapon,
  [ItemType.Greatsword]: ItemSlot.Weapon,
  [ItemType.Helmet]: ItemSlot.Helmet,
  [ItemType.Chestplate]: ItemSlot.Chestplate,
  [ItemType.Gloves]: ItemSlot.Gloves,
  [ItemType.Boots]: ItemSlot.Boots,
};
