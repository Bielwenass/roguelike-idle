import { Container } from '@pixi/display';

function onDragStart(this: any, event: { data: any }) {
  // Store a reference to the data
  // The reason for this is because of multitouch
  // We want to track the movement of this particular touch
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;

  this.dragPoint = {
    x: event.data.global.x - this.x,
    y: event.data.global.y - this.y,
  };
}

function onDragEnd(this: any): void {
  this.alpha = 1;
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

export default {
  initCamera,
};
