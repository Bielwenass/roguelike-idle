import type { Point } from '@pixi/core';
import type { PlayBoard } from '@type/PlayBoard';

export function doesPointExist(pt: Point, pb: PlayBoard): boolean {
  return pb[pt.x]?.[pt.y] !== undefined;
}
