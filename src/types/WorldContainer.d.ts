import { Container } from '@pixi/display';

import { Actor } from './Actor';
import { Entity } from './Entity';

export interface WorldContainer extends Container {
  enemies: Actor[],
  entities: Entity[]
}
