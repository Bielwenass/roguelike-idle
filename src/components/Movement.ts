import { MovementAction } from '../data/enums/MovementAction';

import { Actor } from '../types/Actor';
import { Cell } from '../types/Cell';

export function selectNextMove(self: Actor, playBoard: Cell[][]): Cell {
  const chosenAction = self.movement(self, playBoard);

  if (chosenAction === MovementAction.Left) {
    return playBoard[self.position.x - 1][self.position.y];
  }
  if (chosenAction === MovementAction.Up) {
    return playBoard[self.position.x][self.position.y - 1];
  }
  if (chosenAction === MovementAction.Right) {
    return playBoard[self.position.x + 1][self.position.y];
  }
  if (chosenAction === MovementAction.Down) {
    return playBoard[self.position.x][self.position.y + 1];
  }

  // Don't move if "Skip" action is chosen
  return playBoard[self.position.x][self.position.y];
}
