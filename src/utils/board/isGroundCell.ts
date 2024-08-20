import { doesPointExist } from './doesPointExist';
import { pointToCell } from './pointToCell';

import type { PlayBoard } from '@type/PlayBoard';
import type { Point } from 'pixi.js';

export function isGroundCell(point: Point, playBoard: PlayBoard): boolean {
  return doesPointExist(point, playBoard) && pointToCell(point, playBoard).isGround;
}
