import { Sprite } from '@pixi/sprite';

import { Item } from './Item';

interface ItemSprite extends Sprite {
  item: Item;
}
