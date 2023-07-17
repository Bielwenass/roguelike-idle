import { Container } from '@pixi/display';

import { equipmentGui } from './EquipmentGui';
import { inventoryGui } from './InventoryGui';
import { vaultGui } from './VaultGui';

export function initGui(): Container {
  const gui = new Container();

  gui.addChild(equipmentGui);
  gui.addChild(vaultGui);
  gui.addChild(inventoryGui);

  return gui;
}
