import { Container } from '@pixi/display';

import { EquipmentGui } from './EquipmentGui';
import { inventoryGui } from './InventoryGui';
import { SelectedSlot } from './SelectedSlot';
import { VaultGui } from './VaultGui';
import { state } from '../../State';

import type { StorageGui } from './StorageGui';

export class Gui extends Container {
  private static instance: Gui;

  public static equipment: EquipmentGui;

  public static vault: VaultGui;

  public static backpack: StorageGui;

  private constructor() {
    super();

    Gui.instance = this;
    Gui.equipment = this.addChild(new EquipmentGui(state.inventory.equipped));
    Gui.vault = this.addChild(new VaultGui(state.inventory.vault));
    Gui.backpack = this.addChild(inventoryGui);
    SelectedSlot.vaultGui = Gui.vault;

    Gui.backpack.enableResize(state.app.renderer);
    Gui.vault.enableResize(state.app.renderer);
    Gui.equipment.enableResize(state.app.renderer);
  }

  public static getInstance() {
    if (!Gui.instance) {
      Gui.instance = new Gui();
    }

    return Gui.instance;
  }
}
