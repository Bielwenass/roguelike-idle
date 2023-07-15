import { Point, Texture } from 'pixi.js';

import { Cell } from './Cell';
import { Entity } from './Entity';
import { HpBar } from './HpBar';
import { PlayBoard } from './PlayBoard';
import { ActorType } from '../data/enums/ActorType';
import { CombatAction } from '../data/enums/CombatAction';

export type Strategy = (self: Actor, opponent: Actor) => CombatAction;
export type Movement = (self: Actor, playBoard: PlayBoard) => Point;

export interface ActorBase {
  name: string,
  type: ActorType,
  texture?: Texture,
  maxHealth: number,
  attack: number,
  attackDelay: number,
  defense: number,
  speed: number,
  sightRange: number,
}

export interface Actor extends ActorBase, Entity {
  currentHealth: number,
  hpBar: HpBar,
  strategy: Strategy,
  movements: Movement[],
  lastCells: Cell[],
  lastActionTime: number,
}
