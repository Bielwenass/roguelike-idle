import type { Actor } from './Actor';
import type { Entity } from './Entity';
import type { PlayBoard } from './PlayBoard';
import type { Container } from 'pixi.js';

export interface WorldContainer extends Container {
  enemies: Actor[],
  entities: Entity[],
  board: PlayBoard,
}
