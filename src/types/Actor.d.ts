import type { Cell } from './Cell';
import type { Entity } from './Entity';
import type { HpBar } from './HpBar';
import type { PlayBoard } from './PlayBoard';
import type { ActorType } from '../data/enums/ActorType';
import type { CombatAction } from '../data/enums/CombatAction';
import type { Point, Texture } from 'pixi.js';

export type Strategy = (self: Actor, opponent: Actor) => CombatAction;
export type Movement = (self: Actor, playBoard: PlayBoard) => Point;

export type ChasingGoal = {
  goal: Point,
  turnsLeft: number
};

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
  chasingModel: ChasingGoal,
  lastActionTime: number,
}
