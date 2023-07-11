import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { EntityType } from '../data/enums/EntityType';

export interface Cell {
  position: Point,
  isGround: boolean,
  sprite: Sprite,
  entityType: EntityType,
  wasSeen: boolean,
  hasActor: boolean,
}
