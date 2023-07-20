import { Container } from '@pixi/display';
import { Point } from '@pixi/math';

import { ItemPreview } from './ItemPreview';
import { SelectedSlot } from './SelectedSlot';
import { StorageGui } from './StorageGui';
import { itemSort } from '../../../data/items/itemSort';
import { drawText } from '../../Text';
import { textureUiVaultBg } from '../Graphics';

import type { Item } from '../../../types/Item';
import type { ItemSprite } from '../../../types/ItemSprite';

import type { Text } from '@pixi/text';

export class VaultGui extends StorageGui {
  public selectedSlot: Container;

  private preview?: ItemPreview;

  private sort: (a: Item, b: Item) => number;

  private filter: (e: Item) => boolean;

  constructor(items: Item[]) {
    super(textureUiVaultBg, new Point(960, 540), 80, new Point(14, 16), items);
    this.sort = () => 0;
    this.filter = () => true;
    this.preview = new Container();
    this.offset = new Point(128, 0);
    this.addChild(...this.initSortLabels());
  }

  public updateSlots(): void {
    const filteredContent = this.content.filter(this.filter);
    const sortedContent = filteredContent.sort(this.sort);

    for (const [slotIdx, slot] of this.slots.entries()) {
      slot.onClick = () => {
        SelectedSlot.select(slot);
      };
      slot.setItem(sortedContent[slotIdx]);
    }
  }

  public previewItem(itemSprite: ItemSprite | null) {
    if (this.preview) {
      this.preview.destroy();
    }

    // Happens when the selected slot shifts to an empty space
    if (itemSprite) {
      this.preview = this.addChild(new ItemPreview(itemSprite));
    }
  }

  private initSortLabels(): Text[] {
    let labelX = 12;

    const labels = itemSort.map((sortData) => {
      const text = drawText(sortData.label, 'inventory', new Point(labelX, 3), true);
      const textOffset = 6 - text.width / 2 / 5;

      text.x += textOffset;
      text.scale = new Point(0.2, 0.2);
      labelX += 13;

      text.on('click', () => {
        this.sort = sortData.comparison;
        this.updateSlots();
      });

      return text;
    });

    return labels;
  }
}
