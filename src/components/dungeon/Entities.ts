import { EntityType } from '@data/enums/EntityType';
import { Point, Sprite } from 'pixi.js';

import { isPointVisible } from './Tiling';
import { TILE_SIZE } from '../../constants';
import { textures } from '../graphics/Graphics';

import type { Entity } from '@type/Entity';
import type { WorldContainer } from '@type/WorldContainer';
import type { Container, Texture } from 'pixi.js';

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
        world.entities.push(spawnEntity(world, textures.exit, cell.position, 0));
      }
      if (cell.entityType === EntityType.Chest) {
        world.entities.push(spawnEntity(world, textures.chest, cell.position, 0));
      }
    }
  }

  return world.entities;
}
