import type { Actor } from './Actor';
import type { Container } from '@pixi/display';

export interface CombatContainer extends Container {
  attacker: Actor,
  defender: Actor,
}
