import { Container } from '@pixi/display';

import { Actor } from './Actor';
import { Cell } from './Cell';
import { Entity } from './Entity';

export interface WorldContainer extends Container {
  enemies: Actor[],
  entities: Entity[],
  board: Cell[][],
}
