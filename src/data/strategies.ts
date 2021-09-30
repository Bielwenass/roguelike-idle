import { CombatAction } from './enums/CombatAction';

import { Strategy } from '../types/Actor';

export const strategies = {
  dummy: () => CombatAction.Attack,
} as Record<string, Strategy>;
