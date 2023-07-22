import { CombatAction } from './enums/CombatAction';

import type { StrategyAction, StrategyName } from '@type/Actor';

export const strategies: Record<StrategyName, StrategyAction> = {
  dummy: () => CombatAction.Attack,
};
