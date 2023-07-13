import { MovementAction } from './enums/MovementAction';

import { Movement } from '../types/Actor';

import { isGroundCell } from '../utils/isGroundCell';

export const movements: Record<string, Movement> = {
  random: (self, playBoard) => {
    const availableDirections = [];

    if (isGroundCell(self.position.x - 1, self.position.y, playBoard)) {
      availableDirections.push(MovementAction.Left);
    }
    if (isGroundCell(self.position.x, self.position.y - 1, playBoard)) {
      availableDirections.push(MovementAction.Up);
    }
    if (isGroundCell(self.position.x + 1, self.position.y, playBoard)) {
      availableDirections.push(MovementAction.Right);
    }
    if (isGroundCell(self.position.x, self.position.y + 1, playBoard)) {
      availableDirections.push(MovementAction.Down);
    }

    if (availableDirections.length === 0) {
      return MovementAction.Skip;
    }

    return availableDirections[Math.floor(Math.random() * availableDirections.length)];
  },
};
