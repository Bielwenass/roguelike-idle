import type { PlayBoard } from '@type/PlayBoard';
import type { Point } from 'pixi.js';

export function doesPointExist(pt: Point, pb: PlayBoard): boolean {
  return pb[pt.x]?.[pt.y] !== undefined;
}
