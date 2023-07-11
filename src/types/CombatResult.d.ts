import { Item } from './Item';

export interface CombatResult {
  isWin: boolean,
  rewards: Item[],
}
