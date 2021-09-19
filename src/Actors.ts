import {
  Container,
  IPoint,
  Sprite,
  Texture,
} from 'pixi.js';

import { TILE_SIZE } from './constants';

export interface IActorBase {
  name: string,
  speed: number,
  sightRange: number,
}

export interface IActor extends IActorBase {
  sprite: Sprite,
  position: IPoint,
}

export function spawnActor(
  actorBase: IActorBase,
  texture: Texture,
  parent: Container,
  position: IPoint,
): IActor {
  const actorSprite = parent.addChild(new Sprite(texture));

  actorSprite.width = TILE_SIZE;
  actorSprite.height = TILE_SIZE;
  actorSprite.zIndex = 1;

  actorSprite.x = position.x * TILE_SIZE;
  actorSprite.y = position.y * TILE_SIZE;

  return {
    ...actorBase,
    position,
    sprite: actorSprite,
  };
}
