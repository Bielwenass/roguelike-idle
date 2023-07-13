import { MovementAction } from './enums/MovementAction';

import { Actor, Movement } from '../types/Actor';

import { isGroundCell } from '../utils/isGroundCell';
import { Cell } from '../types/Cell';

export const movements: Record<string, Movement> = {
  random: (self, playBoard) => {
    const availableDirections: MovementAction[] = [];

    const basicDirections = [
      {action: MovementAction.Left, point: [-1, 0]},
      {action: MovementAction.Up, point: [0, -1]},
      {action: MovementAction.Right, point: [1, 0]},
      {action: MovementAction.Down, point: [0, 1]},
    ];

    // 1st cycle: try to find directions without moving backward
    availableDirections.push(...basicDirections.filter(a => 
      isPossibleDirection(self, a.point[0], a.point[1], playBoard) && !isRecentDirection(self, a.point[0], a.point[1])
    ).map(a => a.action));

    if (availableDirections.length > 0) {
      return getRandomDirection(availableDirections);
    }

    // 2nd cycle: try to find any possible direction
    availableDirections.push(...basicDirections.filter(a => 
      isPossibleDirection(self, a.point[0], a.point[1], playBoard)
    ).map(a => a.action));

    if (availableDirections.length === 0) {
      return MovementAction.Skip; 
    }

    return getRandomDirection(availableDirections);
  },
};

function getRandomDirection(availableDirections: MovementAction[]): MovementAction {
  return availableDirections[Math.floor(Math.random() * availableDirections.length)];
}

function isPossibleDirection(actor: Actor, x: number, y: number, playBoard: Cell[][]): boolean {
  return isGroundCell(actor.position.x + x, actor.position.y + y, playBoard);
}

function isRecentDirection(actor: Actor, x: number, y: number): boolean {
  return actor.lastCells.some(o => o.position.x === (actor.position.x + x) && o.position.y === (actor.position.y + y));
}
