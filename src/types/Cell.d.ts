import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { ActorType } from '../data/enums/ActorType';
import { EntityType } from '../data/enums/EntityType';

export interface Cell {
  position: Point,
  isGround: boolean,
  sprite: Sprite,
  entityType: EntityType,
  actorType: ActorType,
  wasSeen: boolean,
  hasActor: boolean,
}
