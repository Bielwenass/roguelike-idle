import { Texture } from 'pixi.js';

import { ActorType } from '../data/enums/ActorType';
import { CombatAction } from '../data/enums/CombatAction';
import { Entity } from './Entity';
import { HpBar } from './HpBar';

export type Strategy = (self: Actor, opponent: Actor) => CombatAction;

export interface ActorBase {
  name: string,
  type: ActorType,
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
  strategy: Strategy,
  lastActionTime: number,
}
