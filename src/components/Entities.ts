import {
  Container,
  Point,
  Sprite,
  Texture,
} from 'pixi.js';

import { textureChest, textureExit } from './Graphics';
import { isPointVisible } from './Tiling';
import { TILE_SIZE } from '../constants';
import { ActorType } from '../data/enums/ActorType';
import { EntityType } from '../data/enums/EntityType';

import { Entity } from '../types/Entity';
import { PlayBoard } from '../types/PlayBoard';
import { WorldContainer } from '../types/WorldContainer';

export function updateEntitiesVisibility(entities: Entity[]) {
  return entities.map((e) => {
    e.sprite.visible = isPointVisible(e.position);

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

export function moveActorOnBoard(pb: PlayBoard, oldPosition: Point, newPosition: Point, type: ActorType): void {
  pb[oldPosition.x][oldPosition.y].hasActor = true;
  pb[oldPosition.x][oldPosition.y].actorType = type;
  pb[newPosition.x][newPosition.y].hasActor = false;
  pb[newPosition.x][newPosition.y].actorType = ActorType.None;
}
