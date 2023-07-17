import {
  Container,
  Point,
  Texture,
} from 'pixi.js';

import { spawnEntity } from './dungeon/Entities';
import { createHpBar } from './graphics/Graphics';
import { movements } from '../data/movements';
import { strategies } from '../data/strategies';

import { Actor, ActorBase } from '../types/Actor';

export function spawnActor(
  actorBase: ActorBase | Actor,
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
    movements: [movements.player, movements.random],
    lastActionTime: -1,
    lastCells: Array(5),
    chasingModel: {
      goal: new Point(0, 0), turnsLeft: 0,
    },
  };
}
