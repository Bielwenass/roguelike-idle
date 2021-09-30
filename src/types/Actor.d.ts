import {
  Texture,
  Sprite,
  Point,
} from 'pixi.js';

import { CombatAction } from '../data/enums/CombatAction';

export type Strategy = (self: Actor, opponent: Actor) => CombatAction;

export interface ActorBase {
  name: string,
  texture?: Texture,
  maxHealth: number,
  attack: number,
  speed: number,
  sightRange: number,
  attackDelay: number,
}

export interface Actor extends ActorBase {
  currentHealth: number,
  sprite: Sprite,
  position: Point,
  strategy: Strategy
}
