import { doesPointExist } from './doesPointExist';
import { pointToCell } from './pointToCell';

import type { Point } from '@pixi/core';
import type { PlayBoard } from '@type/PlayBoard';

export function isGroundCell(point: Point, playBoard: PlayBoard): boolean {
  return doesPointExist(point, playBoard) && pointToCell(point, playBoard).isGround;
}
