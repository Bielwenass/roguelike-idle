import {
  Container,
  Point,
  Sprite,
  Texture,
} from 'pixi.js';

import { textureChest, textureExit } from './Graphics';
import { TILE_SIZE } from '../constants';
import { EntityType } from '../data/enums/EntityType';

import { Actor } from '../types/Actor';
import { Entity } from '../types/Entity';
import { WorldContainer } from '../types/WorldContainer';

import { getDistance } from '../utils/getDistance';

export function updateEntitiesVisibility(entities: Entity[], player: Actor) {
  return entities.map((e) => {
    const dist = getDistance(e.position, player.position);

    e.sprite.visible = dist <= player.sightRange;

    return e;
  });
}

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

export function spawnEntities(world: WorldContainer): Entity[] {
  world.entities = [];

  for (const cellRow of world.board) {
    for (const cell of cellRow) {
      if (cell.entityType === EntityType.Exit) {
        world.entities.push(spawnEntity(world, textureExit, cell.position));
      }
      if (cell.entityType === EntityType.Chest) {
        world.entities.push(spawnEntity(world, textureChest, cell.position));
      }
    }
  }

  return world.entities;
}

export function moveEntity(entity: Entity, point: Point): void {
  entity.position = point;

  entity.sprite.x = point.x * TILE_SIZE;
  entity.sprite.y = point.y * TILE_SIZE;
}
