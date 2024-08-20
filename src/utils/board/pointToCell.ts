import { doesPointExist } from './doesPointExist';

import type { Cell } from '@type/Cell';
import type { PlayBoard } from '@type/PlayBoard';
import type { Point } from 'pixi.js';

export function pointToCell(point: Point, pb: PlayBoard): Cell {
  if (doesPointExist(point, pb)) {
    return pb[point.x]![point.y]!;
  }
  throw new Error('pointToCell: Point is outside of play board bounds');
}
