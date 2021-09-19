import { IPoint } from '@pixi/math';

export default function getDistance(a: IPoint, b: IPoint) {
  const xDist = Math.abs(a.x - b.x);
  const yDist = Math.abs(a.y - b.y);

  return xDist + yDist;
}
