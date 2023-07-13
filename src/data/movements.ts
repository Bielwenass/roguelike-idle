import { MovementAction } from './enums/MovementAction';
import { isPossibleDirection, isRecentDirection } from '../components/Movement';

import { Movement } from '../types/Actor';

function getRandomDirection(availableDirections: MovementAction[]): MovementAction {
  return availableDirections[Math.floor(Math.random() * availableDirections.length)];
}

export const basicDirections = [
  {
    action: MovementAction.Left, point: [-1, 0],
  },
  {
    action: MovementAction.Up, point: [0, -1],
  },
  {
    action: MovementAction.Right, point: [1, 0],
  },
  {
    action: MovementAction.Down, point: [0, 1],
  },
];

export const movements: Record<string, Movement> = {
  random: (self, playBoard) => {
    // try to find any possible direction
    const availableDirections = basicDirections.filter((a) => isPossibleDirection(self, a.point, playBoard));

    // try to find directions without moving backward
    const notVisitedDirections = availableDirections.filter((a) => !isRecentDirection(self, a.point));

    if (notVisitedDirections.length > 0) {
      return getRandomDirection(notVisitedDirections.map((a) => a.action));
    }

    if (availableDirections.length === 0) {
      return MovementAction.Skip;
    }

    return getRandomDirection(availableDirections.map((a) => a.action));
  },
};
