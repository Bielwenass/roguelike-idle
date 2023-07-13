import { Item } from './Item';
import { ItemSlot } from '../data/enums/ItemSlot';

export type EquippedItems = { [key in ItemSlot]: Item | null };
