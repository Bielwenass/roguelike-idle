import { sumPoints } from '@utils/sumPoints';

import { isGroundCell } from './isGroundCell';

import type { Point } from '@pixi/core';
import type { PlayBoard } from '@type/PlayBoard';

export function isValidDirection(origin: Point, to: Point, playBoard: PlayBoard): boolean {
  return isGroundCell(sumPoints(origin, to), playBoard);
}
