import { sumPoints } from '@utils/sumPoints';

import { isGroundCell } from './isGroundCell';

import type { PlayBoard } from '@type/PlayBoard';
import type { Point } from 'pixi.js';

export function isValidDirection(origin: Point, to: Point, playBoard: PlayBoard): boolean {
  return isGroundCell(sumPoints(origin, to), playBoard);
}
