import { MovementAction } from '../data/enums/MovementAction';

import { Actor } from '../types/Actor';
import { Cell } from '../types/Cell';

export function selectNextMove(self: Actor, playBoard: Cell[][]): Cell {
  switch (self.movement(self, playBoard)) {
    case MovementAction.Left:
      return playBoard[self.position.x - 1][self.position.y];

    case MovementAction.Up:
      return playBoard[self.position.x][self.position.y - 1];

    case MovementAction.Right:
      return playBoard[self.position.x + 1][self.position.y];

    case MovementAction.Down:
      return playBoard[self.position.x][self.position.y + 1];
  
    default:
      // Don't move if "Skip" action is chosen
      return playBoard[self.position.x][self.position.y];
  }
}
