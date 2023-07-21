import { Point } from '@pixi/core';

import { itemSlotByType } from './itemSlotByType';

import type { Item } from '@type/Item';

export const itemFilter = [
  {
    label: 'ALL',
    position: new Point(5.5, 14.5),
    func: () => true,
  },
  {
    label: 'WPN',
    position: new Point(5.5, 24.5),
    func: (e: Item) => itemSlotByType[e.type] === 0,
  },
  {
    label: 'HLM',
    position: new Point(5.5, 31.5),
    func: (e: Item) => itemSlotByType[e.type] === 1,
  },
  {
    label: 'CHS',
    position: new Point(5.5, 38.5),
    func: (e: Item) => itemSlotByType[e.type] === 2,
  },
  {
    label: 'GLV',
    position: new Point(5.5, 45.5),
    func: (e: Item) => itemSlotByType[e.type] === 3,
  },
  {
    label: 'BOT',
    position: new Point(5.5, 52.5),
    func: (e: Item) => itemSlotByType[e.type] === 4,
  },
];
