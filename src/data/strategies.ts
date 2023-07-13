import { CombatAction } from './enums/CombatAction';

import { Strategy } from '../types/Actor';

export const strategies: Record<string, Strategy> = {
  dummy: () => CombatAction.Attack,
};
