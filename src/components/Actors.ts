import {
  Container,
  Point,
  Sprite,
  Texture,
} from 'pixi.js';

import { TILE_SIZE } from '../constants';
import { strategies } from '../data/strategies';
import { createHpBar } from './Graphics';

import { Actor, ActorBase } from '../types/Actor';

export function spawnActor(
  actorBase: ActorBase,
  parent: Container,
  texture: Texture,
  position: Point = new Point(0, 0),
): Actor {
  const actorSprite = parent.addChild(new Sprite(texture ?? actorBase.texture));

  actorSprite.width = TILE_SIZE;
  actorSprite.height = TILE_SIZE;
  actorSprite.zIndex = 1;

  actorSprite.x = position.x * TILE_SIZE;
  actorSprite.y = position.y * TILE_SIZE;

  const hpBar = createHpBar();

  hpBar.visible = false;
  actorSprite.addChild(hpBar);

  return {
    ...actorBase,
    position,
    hpBar,
    currentHealth: actorBase.maxHealth,
    sprite: actorSprite,
    strategy: strategies.dummy,
  };
}
