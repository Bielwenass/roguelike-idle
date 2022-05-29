import { Texture } from 'pixi.js';

import { CombatAction } from '../data/enums/CombatAction';
import { Entity } from './Entity';
import { HpBar } from './HpBar';

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

export interface Actor extends ActorBase, Entity {
  currentHealth: number,
  hpBar: HpBar,
  strategy: Strategy
}
