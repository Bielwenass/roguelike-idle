import type { Item } from './Item';
import type { Sprite } from '@pixi/sprite';

interface ItemSprite extends Sprite {
  item: Item;
}
