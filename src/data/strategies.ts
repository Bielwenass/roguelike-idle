import { CombatAction } from './enums/CombatAction';

import type { Strategy } from '../types/Actor';

export const strategies: Record<string, Strategy> = {
  dummy: () => CombatAction.Attack,
};
