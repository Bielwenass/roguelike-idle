import { Container } from '@pixi/display';

import { Actor } from './Actor';
import { Entity } from './Entity';
import { PlayBoard } from './PlayBoard';

export interface WorldContainer extends Container {
  enemies: Actor[],
  entities: Entity[],
  board: PlayBoard,
}
