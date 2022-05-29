import {
  Container,
  Point,
  Sprite,
  Texture,
} from 'pixi.js';

import { TILE_SIZE } from '../constants';

import { Actor } from '../types/Actor';
import { Entity } from '../types/Entity';

import getDistance from '../utils/getDistance';

export function spawnEntity(
  parent: Container,
  texture: Texture,
  position: Point = new Point(0, 0),
  zIndex: number = 1,
): Entity {
  const sprite = parent.addChild(new Sprite(texture));

  sprite.width = TILE_SIZE;
  sprite.height = TILE_SIZE;
  sprite.zIndex = zIndex;

  sprite.x = position.x * TILE_SIZE;
  sprite.y = position.y * TILE_SIZE;

  sprite.visible = false;

  return {
    position,
    sprite,
  };
}

export function updateEntities(entities: Entity[], player: Actor) {
  return entities.map((e) => {
    const dist = getDistance(e.position, player.position);

    e.sprite.visible = dist <= player.sightRange;

    return e;
  });
}

export function moveEntity(entity: Entity, point: Point): void {
  entity.position = point;

  entity.sprite.x = point.x * TILE_SIZE;
  entity.sprite.y = point.y * TILE_SIZE;
}
