import { EntityType } from '@data/enums/EntityType';
import { Point } from '@pixi/core';
import { Sprite } from '@pixi/sprite';

import { isPointVisible } from './Tiling';
import { TILE_SIZE } from '../../constants';
import { textureExit, textureChest } from '../graphics/Graphics';

import type { Texture } from '@pixi/core';
import type { Container } from '@pixi/display';
import type { Entity } from '@type/Entity';
import type { WorldContainer } from '@type/WorldContainer';

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
        world.entities.push(spawnEntity(world, textureExit, cell.position, 0));
      }
      if (cell.entityType === EntityType.Chest) {
        world.entities.push(spawnEntity(world, textureChest, cell.position, 0));
      }
    }
  }

  return world.entities;
}
