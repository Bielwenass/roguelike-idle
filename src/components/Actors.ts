import {
  Container,
  Point,
  Texture,
} from 'pixi.js';

import { strategies } from '../data/strategies';
import { spawnEntity } from './Entities';
import { createHpBar } from './Graphics';

import { Actor, ActorBase } from '../types/Actor';

export function spawnActor(
  actorBase: ActorBase,
  parent: Container,
  texture: Texture,
  position: Point = new Point(0, 0),
): Actor {
  const actorEntity = spawnEntity(parent, texture, position);
  const hpBar = createHpBar();

  hpBar.visible = false;
  actorEntity.sprite.addChild(hpBar);

  return {
    ...actorBase,
    ...actorEntity,
    hpBar,
    currentHealth: actorBase.maxHealth,
    strategy: strategies.dummy,
    lastActionTime: -1,
  };
}
