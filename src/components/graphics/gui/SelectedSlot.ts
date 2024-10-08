import { ColorMatrixFilter } from 'pixi.js';

import type { InventorySlot } from './InventorySlot';
import type { VaultGui } from './VaultGui';

export class SelectedSlot {
  public static vaultGui: VaultGui;

  private static selected: InventorySlot | null = null;

  public static select(newSelected: InventorySlot) {
    if (this.selected) {
      this.selected.filters = [];
    }

    const darken = new ColorMatrixFilter();

    darken.brightness(0.5, false);
    this.selected = newSelected;
    this.selected.filters = [darken];

    this.vaultGui.previewItem(this.selected.itemSprite!);
  }

  public static clear() {
    if (this.selected) {
      this.selected.filters = [];
    }
  }

  public static update() {
    if (this.selected) {
      this.vaultGui.previewItem(this.selected.itemSprite);
    }
  }
}
