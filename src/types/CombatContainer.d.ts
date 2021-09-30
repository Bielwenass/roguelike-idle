import { Container } from '@pixi/display';

import { Actor } from './Actor';

export interface CombatContainer extends Container {
  enemy: Actor,
  initiative: 'player' | 'enemy',
}
