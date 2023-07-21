import { Point } from '@pixi/core';

export function sumPoints(point1: Point, point2: Point): Point {
  return new Point(point1.x + point2.x, point1.y + point2.y);
}
