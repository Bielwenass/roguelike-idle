import { ActorType } from './enums/ActorType';
import { EntityType } from './enums/EntityType';
import { MovementStrategy } from './enums/MovementStrategy';
import {
  basicDirections, findPathBfs, findPathForSpecificCell,
  getRandomDirection, isPossibleDirection, isRecentDirection, sumPoint,
} from '../components/dungeon/movement/MovementAlgorithm';

import type { Movement } from '../types/Actor';
import type { Cell } from '../types/Cell';

type MovementStrategyData = {
  [key: number]: (cell: Cell) => boolean
};

const strats: MovementStrategyData = {
  [MovementStrategy.Wandering]: (cell) => cell.isGround,
  [MovementStrategy.Exploring]: (cell) => !cell.wasSeen,
  [MovementStrategy.Exit]: (cell) => cell.entityType === EntityType.Exit,
  [MovementStrategy.Treasure]: (cell) => cell.entityType === EntityType.Chest,
  [MovementStrategy.Enemy]: (cell) => cell.actor?.type === ActorType.Enemy,
  [MovementStrategy.Player]: (cell) => cell.actor?.type === ActorType.Player,
};

export const movements: Record<string, Movement> = {
  random: (self, playBoard) => {
    // Try to find any possible direction
    const availableDirections = basicDirections.filter((a) => isPossibleDirection(self, a.point, playBoard));

    // Try to find directions without moving backward
    const notVisitedDirections = availableDirections.filter((a) => !isRecentDirection(self, a.point));

    if (notVisitedDirections.length > 0) {
      return getRandomDirection(notVisitedDirections.map((a) => sumPoint(a.point, self.position)));
    }

    if (availableDirections.length === 0) {
      return self.position;
    }

    return getRandomDirection(availableDirections.map((a) => sumPoint(a.point, self.position)));
  },
  exploring: (self, pb) => findPathBfs(pb, self, strats[MovementStrategy.Exploring], true)[0] ?? self.position,
  exit: (self, pb) => findPathBfs(pb, self, strats[MovementStrategy.Exit])[0] ?? self.position,
  treasure: (self, pb) => findPathBfs(pb, self, strats[MovementStrategy.Treasure])[0] ?? self.position,
  enemy: (self, pb) => findPathBfs(pb, self, strats[MovementStrategy.Enemy])[0] ?? self.position,
  player: (self, pb) => {
    const pathToPlayer = findPathBfs(pb, self, strats[MovementStrategy.Player]);

    if (pathToPlayer.length > 1) {
      // Update chasing model if the player is in the sight range
      self.chasingModel.goal = pathToPlayer[pathToPlayer.length - 1];
      self.chasingModel.turnsLeft = 3;
    } else if (pathToPlayer.length === 0 && self.chasingModel && self.chasingModel.turnsLeft > 0) {
      // Enemy can't see the player, start chasing
      self.chasingModel.turnsLeft -= 1;

      return findPathForSpecificCell(pb, self, self.chasingModel.goal)[0] ?? self.position;
    }

    return pathToPlayer[0] ?? self.position;
  },
};
