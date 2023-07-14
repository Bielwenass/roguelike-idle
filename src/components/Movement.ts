import { MovementAction } from '../data/enums/MovementAction';

import { Actor } from '../types/Actor';
import { Cell } from '../types/Cell';
import { PlayBoard } from '../types/PlayBoard';

import { isGroundCell } from '../utils/isGroundCell';

export function selectNextMove(self: Actor, playBoard: PlayBoard): Cell {
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

export function isPossibleDirection(actor: Actor, point: number[], playBoard: PlayBoard): boolean {
  return isGroundCell(actor.position.x + point[0], actor.position.y + point[1], playBoard);
}

export function isRecentDirection(actor: Actor, point: number[]): boolean {
  return actor.lastCells.some((e) => e.position.x === (actor.position.x + point[0])
  && e.position.y === (actor.position.y + point[1]));
}
