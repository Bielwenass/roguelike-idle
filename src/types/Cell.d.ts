import type { Actor } from './Actor';
import type { EntityType } from '@data/enums/EntityType';
import type { Point } from '@pixi/core';
import type { Sprite } from '@pixi/sprite';

export interface Cell {
  position: Point,
  isGround: boolean,
  sprite: Sprite,
  actor: Actor | null,
  entityType: EntityType,
  wasSeen: boolean,
}
