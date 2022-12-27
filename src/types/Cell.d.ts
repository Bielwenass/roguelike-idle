import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { TileType } from '../data/enums/TileType';

export interface Cell {
  ground: boolean,
  type: TileType,
  sprite: Sprite,
  position: Point,
  seen: boolean,
}
