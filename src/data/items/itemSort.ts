import { Point } from 'pixi.js';

import type { Item } from '@type/Item';

export const itemSort = [
  {
    label: 'Level',
    position: new Point(18, 3),
    func: (a: Item, b: Item) => ((a.level ?? 0) < (b.level ?? 0) ? 1 : -1),
  },
  {
    label: 'Atk',
    position: new Point(31, 3),
    func: (a: Item, b: Item) => ((a.attack ?? 0) < (b.attack ?? 0) ? 1 : -1),
  },
  {
    label: 'AtkS',
    position: new Point(44, 3),
    func: (a: Item, b: Item) => (
      (a.attackDelay ?? Number.POSITIVE_INFINITY) > (b.attackDelay ?? Number.POSITIVE_INFINITY) ? 1 : -1
    ),
  },
  {
    label: 'Def',
    position: new Point(57, 3),
    func: (a: Item, b: Item) => ((a.defense ?? 0) < (b.defense ?? 0) ? 1 : -1),
  },
  {
    label: 'Speed',
    position: new Point(70, 3),
    func: (a: Item, b: Item) => ((a.speed ?? 0) < (b.speed ?? 0) ? 1 : -1),
  },
  {
    label: 'Gold',
    position: new Point(83, 3),
    func: (a: Item, b: Item) => ((a.goldValue ?? 0) < (b.goldValue ?? 0) ? 1 : -1),
  },
];
