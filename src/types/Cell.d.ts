import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { Actor } from './Actor';
import { EntityType } from '../data/enums/EntityType';

export interface Cell {
  position: Point,
  isGround: boolean,
  sprite: Sprite,
  actor: Actor | null,
  entityType: EntityType,
  wasSeen: boolean,
}
