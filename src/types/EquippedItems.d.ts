import { ItemSlot } from '../data/enums/ItemSlot';
import { Item } from './Item';

export type EquippedItems = { [key in ItemSlot]: Item | null };
