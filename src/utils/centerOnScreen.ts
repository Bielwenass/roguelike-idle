import { Point } from 'pixi.js';

import { getScreenCenterX, getScreenCenterY } from '../components/Camera';

import type { Container } from 'pixi.js';

export function centerOnScreen(container: Container, offset: Point = new Point(0, 0)): Container {
  container.x = getScreenCenterX() - (container.width / 2) + offset.x;
  container.y = getScreenCenterY() - (container.height / 2) + offset.y;

  return container;
}
