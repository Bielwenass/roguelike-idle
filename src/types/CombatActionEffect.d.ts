import type { Actor } from './Actor';

export type CombatActionEffect = (self: Actor, opponent: Actor) => {
  self: Actor,
  opponent: Actor,
};
