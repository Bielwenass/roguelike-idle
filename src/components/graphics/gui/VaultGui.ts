import { itemFilter } from '@data/items/itemFilter';
import { itemSort } from '@data/items/itemSort';
import { Container, Point } from 'pixi.js';

import { ItemPreview } from './ItemPreview';
import { SelectedSlot } from './SelectedSlot';
import { StorageGui } from './StorageGui';
import { drawText } from '../../Text';
import { textureUiVaultBg } from '../Graphics';

import type { Item } from '@type/Item';
import type { ItemSprite } from '@type/ItemSprite';
import type { Text } from 'pixi.js';

export class VaultGui extends StorageGui {
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
    this.addChild(...this.initFilterLabels());
  }

  public override updateSlots(): void {
    const filteredContent = this.content.filter(this.filter);
    const sortedContent = filteredContent.sort(this.sort);

    for (const [slotIdx, slot] of this.slots.entries()) {
      slot.onClick = () => {
        SelectedSlot.select(slot);
      };
      slot.setItem(sortedContent[slotIdx] ?? null);
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
    const labels = itemSort.map((sortData) => {
      const text = drawText(sortData.label, 'inventory', sortData.position, true);
      // Divide by 5 to account for scale
      const textOffset = -text.width / 2 / 5;

      text.x += textOffset;
      text.scale = new Point(0.2, 0.2);

      text.on('click', () => {
        this.sort = sortData.func;
        this.updateSlots();
        SelectedSlot.update();
      });

      return text;
    });

    return labels;
  }

  private initFilterLabels(): Text[] {
    const labels = itemFilter.map((filterData) => {
      const text = drawText(filterData.label, 'inventory', filterData.position, true);
      // Divide by 5 to account for scale
      const textOffset = -text.width / 2 / 5;

      text.x += textOffset;
      text.scale = new Point(0.2, 0.2);

      text.on('click', () => {
        this.filter = filterData.func;
        this.updateSlots();
        SelectedSlot.update();
      });

      return text;
    });

    return labels;
  }
}
