import { Point } from 'pixi.js';

import { StorageGui } from './StorageGui';
import { state } from '../../State';
import { textures } from '../Graphics';

export const inventoryGui = new StorageGui(
  textures.uiInventoryBg,
  new Point(595, 210),
  30,
  new Point(5, 5),
  state.inventory.backpack,
);
