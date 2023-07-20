import type { Point } from '@pixi/core';
import type { Sprite } from '@pixi/sprite';

export interface Entity {
  position: Point,
  sprite: Sprite
}
