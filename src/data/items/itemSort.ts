import { Item } from '../../types/Item';

export const itemSort = [
  {
    label: 'Level',
    comparison: (a: Item, b: Item) => ((a.level ?? 0) < (b.level ?? 0) ? 1 : -1),
  },
  {
    label: 'Atk',
    comparison: (a: Item, b: Item) => ((a.attack ?? 0) < (b.attack ?? 0) ? 1 : -1),
  },
  {
    label: 'AtkS',
    comparison: (a: Item, b: Item) => (
      (a.attackDelay ?? Number.POSITIVE_INFINITY) > (b.attackDelay ?? Number.POSITIVE_INFINITY) ? 1 : -1
    ),
  },
  {
    label: 'Def',
    comparison: (a: Item, b: Item) => ((a.defense ?? 0) < (b.defense ?? 0) ? 1 : -1),
  },
  {
    label: 'Speed',
    comparison: (a: Item, b: Item) => ((a.speed ?? 0) < (b.speed ?? 0) ? 1 : -1),
  },
  {
    label: 'Gold',
    comparison: (a: Item, b: Item) => ((a.goldValue ?? 0) < (b.goldValue ?? 0) ? 1 : -1),
  },
];
