import type { Point } from 'pixi.js';

export function getDistance(a: Point, b: Point) {
  const xDist = Math.abs(a.x - b.x);
  const yDist = Math.abs(a.y - b.y);

  return xDist + yDist;
}
