import { Point } from 'pixi.js';

import { MovementAction } from '../data/enums/MovementAction';

import { Actor } from '../types/Actor';
import { Cell } from '../types/Cell';
import { PlayBoard } from '../types/PlayBoard';

import { getDistance } from '../utils/getDistance';
import { isEqualPoint } from '../utils/isEqualPoint';
import { isGroundCell } from '../utils/isGroundCell';

export function selectNextMove(self: Actor, playBoard: PlayBoard): Cell {
  let newPoint = self.position;

  for (const movement of self.movements) {
    newPoint = movement(self, playBoard);

    if (newPoint.x !== self.position.x || newPoint.y !== self.position.y) {
      break;
    }
  }

  return playBoard[newPoint.x][newPoint.y];
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

export function sumPoint(point1: Point, point2: Point): Point {
  return new Point(point1.x + point2.x, point1.y + point2.y);
}

export function getDirectionsForPoint(point: Point): Point[] {
  return basicDirections.map((e) => new Point(point.x + e.point.x, point.y + e.point.y));
}

export function getRandomDirection(availableDirections: Point[]): Point {
  return availableDirections[Math.floor(Math.random() * availableDirections.length)];
}

export function doesPointExists(pb: PlayBoard, pt: Point) {
  return pb[pt.x] !== undefined && pb[pt.x][pt.y] !== undefined;
}

export function isPossibleDirection(actor: Actor, point: Point, playBoard: PlayBoard): boolean {
  return isGroundCell(actor.position.x + point.x, actor.position.y + point.y, playBoard);
}

export function isRecentDirection(actor: Actor, relPoint: Point): boolean {
  return actor.lastCells.some((e) => isEqualPoint(e.position, sumPoint(actor.position, relPoint)));
}

// Breadth-first Search
// Can be used to overview a tiles in a sight range
export function basicBfs(pb: PlayBoard, root: Point, depth: number): Point[] {
  const queue: Point[] = [];
  const explored: Point[] = [];

  queue.push(root);

  while (queue.length > 0) {
    const current = queue.pop()!;

    if (isGroundCell(current.x, current.y, pb)) {
      const neighbors = getDirectionsForPoint(current)
        .filter((e) => doesPointExists(pb, e))
        .filter((e) => !explored.some((c) => isEqualPoint(c, e)))
        .filter((e) => getDistance(e, root) <= depth);

      queue.unshift(...neighbors);
    }
    explored.push(current);
  }

  return explored;
}

// Pathfinding function based on BFS
// Finds the nearest point that fits the condition of the passed function
export function findPathBfs(
  pb: PlayBoard,
  actor: Actor,
  goalCheck: (cell: Cell) => boolean,
  ignoreSight?: boolean,
): Point[] {
  // queue stores tiles we need to check
  // also has info about a previous position
  const queue: { pos: Point, prev: Point | null }[] = [];

  // explored -- points we already checked
  const explored: { [key: string]: Point } = {};

  // path restored based on a backtrace from the goal to the root
  const path: Point[] = [];

  const root = actor.position;
  let goal;
  let strGoalPoint = `${root.x},${root.y}`;
  let strCurrentPoint: string;

  queue.push({
    pos: root,
    prev: null,
  });

  // processing queue of unexplored tiles
  while (queue.length > 0) {
    const current = queue.pop()!;

    if (isGroundCell(current.pos.x, current.pos.y, pb)) {
      const neighbors = getDirectionsForPoint(current.pos)
        .filter((e) => doesPointExists(pb, e))
        .filter((e) => getDistance(root, e) <= actor.sightRange || ignoreSight)
        .filter((e) => !Object.keys(explored).includes(`${e.x},${e.y}`))
        .map((e) => ({
          pos: e, prev: current.pos,
        }));

      queue.unshift(...neighbors);
    }

    strCurrentPoint = `${current.pos.x},${current.pos.y}`;

    explored[strCurrentPoint] = current.prev!;
    if (goalCheck(pb[current.pos.x][current.pos.y])) {
      strGoalPoint = `${current.pos.x},${current.pos.y}`;
      goal = current.pos;
      break;
    }
  }

  // restore path
  strCurrentPoint = strGoalPoint;
  if (goal) {
    path.push(goal);
  }
  while (Object.keys(explored).includes(strCurrentPoint) && explored[strCurrentPoint]) {
    const currentPt = explored[strCurrentPoint];

    path.unshift(currentPt);
    strCurrentPoint = `${currentPt.x},${currentPt.y}`;
  }
  path.shift();

  return path;
}

// not used for now but may be useful
export function findPathForSpecificCell(pb: PlayBoard, actor: Actor, goal: Cell): Point[] {
  return findPathBfs(pb, actor, (cell: Cell) => isEqualPoint(cell.position, goal.position));
}
