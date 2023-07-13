import { CombatAction } from './enums/CombatAction';
import { getDamage } from '../components/formulas/Attack';

import { Actor } from '../types/Actor';

export const combatActionEffects = {
  [CombatAction.Attack]: (self: Actor, opponent: Actor) => ({
    self,
    opponent: {
      ...opponent,
      currentHealth: opponent.currentHealth - getDamage(self, opponent),
    } as Actor,
  }),
  // TODO
  [CombatAction.Defend]: (self: Actor, opponent: Actor) => ({
    self,
    opponent,
  }),
  // TODO
  [CombatAction.Heal]: (self: Actor, opponent: Actor) => ({
    self,
    opponent,
  }),
  // TODO
  [CombatAction.Wait]: (self: Actor, opponent: Actor) => ({
    self,
    opponent,
  }),
};
