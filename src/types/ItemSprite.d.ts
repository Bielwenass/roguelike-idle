import type { Item } from './Item';
import type { Sprite } from 'pixi.js';

interface ItemSprite extends Sprite {
  item: Item;
}
