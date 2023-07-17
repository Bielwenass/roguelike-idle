import { Container } from '@pixi/display';

import { Actor } from './Actor';

export interface CombatContainer extends Container {
  attacker: Actor,
  defender: Actor,
}
