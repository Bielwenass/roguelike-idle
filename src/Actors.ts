import { IPoint, Sprite } from 'pixi.js';

export interface Actor {
  name: string,
  sprite: Sprite,
  position: IPoint,
  speed: number,
  sightRange: number,
}
