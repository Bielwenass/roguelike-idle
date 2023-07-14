import { Point } from 'pixi.js';

import { MovementAction } from '../data/enums/MovementAction';

import { Actor } from '../types/Actor';
import { Cell } from '../types/Cell';
import { PlayBoard } from '../types/PlayBoard';

import { getDistance } from '../utils/getDistance';
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

export const basicDirections = [
  {
    action: MovementAction.Left, point: new Point(-1, 0),
  },
  {
    action: MovementAction.Up, point: new Point(0, -1),
  },
  {
    action: MovementAction.Right, point: new Point(1, 0),
  },
  {
    action: MovementAction.Down, point: new Point(0, 1),
  },
];

export function getDirectionsForPoint(point: Point): Point[] {
  return basicDirections.map((e) => new Point(point.x + e.point.x, point.y + e.point.y));
}

export function getRandomDirection(availableDirections: MovementAction[]): MovementAction {
  return availableDirections[Math.floor(Math.random() * availableDirections.length)];
}

export function basicBfs(pb: PlayBoard, root: Point, depth: number): Point[] {
  const queue: Point[] = [];
  const explored: Point[] = [];

  queue.unshift(root);

  while (queue.length > 0) {
    const current = queue.pop();

    if (isGroundCell(current!.x, current!.y, pb)) {
      const neighbors = getDirectionsForPoint(current!)
        .filter((e) => !explored.some((c) => c.x === e.x && c.y === e.y))
        .filter((e) => getDistance(e, root) <= depth);

      queue.unshift(...neighbors);
    }
    explored.push(current!);
  }

  return explored;
}

export function isPossibleDirection(actor: Actor, point: Point, playBoard: PlayBoard): boolean {
  return isGroundCell(actor.position.x + point.x, actor.position.y + point.y, playBoard);
}

export function isRecentDirection(actor: Actor, point: Point): boolean {
  return actor.lastCells.some((e) => e.position.x === (actor.position.x + point.x)
  && e.position.y === (actor.position.y + point.y));
}
