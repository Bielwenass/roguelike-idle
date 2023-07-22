import { MovementAction } from '@data/enums/MovementAction';
import { Point } from '@pixi/core';
import { doesPointExist } from '@utils/board/doesPointExist';
import { isGroundCell } from '@utils/board/isGroundCell';
import { pointToCell } from '@utils/board/pointToCell';
import { getDistance } from '@utils/getDistance';
import { isEqualPoint } from '@utils/isEqualPoint';
import { sumPoints } from '@utils/sumPoints';

import type { Actor } from '@type/Actor';
import type { Cell } from '@type/Cell';
import type { PlayBoard } from '@type/PlayBoard';

export function selectNextMove(self: Actor, playBoard: PlayBoard): Cell {
  for (const movement of self.movements) {
    const newPoint = movement(self, playBoard);

    const isSamePoint = isEqualPoint(self.position, newPoint);
    const hasFriendlyActor = pointToCell(newPoint, playBoard).actor?.type === self.type;

    if (!isSamePoint && !hasFriendlyActor) {
      return pointToCell(newPoint, playBoard);
    }
  }

  return pointToCell(self.position, playBoard);
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

export function getRandomDirection(availableDirections: Point[]): Point {
  return availableDirections[Math.floor(Math.random() * availableDirections.length)]!;
}

export function isRecentDirection(actor: Actor, relPoint: Point): boolean {
  return actor.lastCells.some((e) => isEqualPoint(e.position, sumPoints(actor.position, relPoint)));
}

// Calculates whether point 0 can see point 1
// https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
function arePointsOnSameLine(p0: Point, p1: Point, pb: PlayBoard) {
  let x0 = p0.x;
  let y0 = p0.y;
  const x1 = p1.x;
  const y1 = p1.y;

  const Δx = Math.abs(x1 - x0);
  const sx = (x0 < x1) ? 1 : -1;

  const Δy = -Math.abs(y1 - y0);
  const sy = (y0 < y1) ? 1 : -1;

  let diff = Δx + Δy;
  let curPoint = p0;

  while (!isEqualPoint(curPoint, p1)) {
    const e2 = 2 * diff;

    if (e2 < Δx) {
      diff += Δx;
      y0 += sy;
    }
    if (e2 > Δy) {
      diff += Δy;
      x0 += sx;
    }
    curPoint = new Point(x0, y0);

    if (!isGroundCell(curPoint, pb) && !isEqualPoint(curPoint, p1)) {
      return false;
    }
  }

  return true;
}

// Breadth-first Search
// Can be used to overview a tiles in a sight range
export function basicBfs(pb: PlayBoard, root: Point, depth: number): Point[] {
  const queue: Point[] = [];
  const explored: Point[] = [];

  queue.push(root);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (isGroundCell(current, pb)) {
      const neighbors = getDirectionsForPoint(current)
        .filter((e) => doesPointExist(e, pb))
        .filter((e) => !explored.some((c) => isEqualPoint(c, e)))
        .filter((e) => getDistance(e, root) <= depth)
        .filter((e) => arePointsOnSameLine(root, e, pb));

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
  // Queue stores tiles we need to check
  // Also has info about the previous position
  const queue: { pos: Point, prev: Point | null }[] = [];

  // Explored -- points we already checked
  const explored: { [key: string]: Point } = {};

  // Path restored based on a backtrace from the goal to the root
  const path: Point[] = [];

  const root = actor.position;
  let goal;
  let strGoalPoint = `${root.x},${root.y}`;
  let strCurrentPoint: string;

  queue.push({
    pos: root,
    prev: null,
  });

  // Processing queue of unexplored tiles
  while (queue.length > 0) {
    const current = queue.pop()!;

    if (isGroundCell(current.pos, pb)) {
      const neighbors = getDirectionsForPoint(current.pos)
        .filter((e) => doesPointExist(e, pb))
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

  // Restore path
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

export function findPathForSpecificCell(pb: PlayBoard, actor: Actor, goal: Point): Point[] {
  return findPathBfs(pb, actor, (cell: Cell) => isEqualPoint(cell.position, goal));
}
