import { Container } from '@pixi/display';
import { Rectangle, Sprite } from 'pixi.js';

import { state } from './State';

function onDragStart(this: any, event: { data: any }) {
  // Store a reference to the data
  // The reason for this is because of multitouch
  // We want to track the movement of this particular touch
  this.data = event.data;
  // this.alpha = 0.5;
  this.dragging = true;

  this.dragPoint = {
    x: event.data.global.x - this.x,
    y: event.data.global.y - this.y,
  };
}

function onDragEnd(this: any): void {
  // this.alpha = 1;
  this.dragging = false;

  // Set the interaction data to null
  this.data = null;
}

function onDragMove(this: any): void {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);

    this.x = newPosition.x - this.dragPoint.x;
    this.y = newPosition.y - this.dragPoint.y;
  }
}

export function getScreenCenterX(): number {
  return state.app.screen.width / 2;
}

export function getScreenCenterY(): number {
  return state.app.screen.height / 2;
}

export function centerCameraOn(camera: Container, center: Sprite, screen: Rectangle): void {
  camera.position.x = screen.width / 2 - center.width / 2 - center.x;
  camera.position.y = screen.height / 2 - center.height / 2 - center.y;
}

export function initCamera(): Container {
  const camera = new Container();

  camera.interactive = true;

  camera
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

  return camera;
}
