import type { Point } from 'pixi.js';

export function isEqualPoint(point1: Point, point2: Point) {
  return point1 && point2 && point1.x === point2.x && point1.y === point2.y;
}
