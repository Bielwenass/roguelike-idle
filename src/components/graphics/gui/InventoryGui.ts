import { Point } from '@pixi/core';

import { StorageGui } from './StorageGui';
import { state } from '../../State';
import { textureUiInventoryBg } from '../Graphics';

export const inventoryGui = new StorageGui(
  textureUiInventoryBg,
  new Point(595, 210),
  30,
  new Point(5, 5),
  state.inventory.backpack,
);
