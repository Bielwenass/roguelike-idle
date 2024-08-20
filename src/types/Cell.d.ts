import type { Actor } from './Actor';
import type { EntityType } from '@data/enums/EntityType';
import type { Point, Sprite } from 'pixi.js';

export interface Cell {
  position: Point,
  isGround: boolean,
  sprite: Sprite,
  actor: Actor | null,
  entityType: EntityType,
  wasSeen: boolean,
}
