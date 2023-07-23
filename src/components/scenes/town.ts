import { enterDungeon } from '@dungeon/Dungeon';
import { Gui } from '@gui/Gui';
import { SelectedSlot } from '@gui/SelectedSlot';
import { Point } from '@pixi/core';

import { GameScene } from '../scene/game';
import { type State } from '../State';
import { drawText } from '../Text';

export class TownScene extends GameScene {
  public constructor(private save: () => void, private readonly meta: State['meta']) {
    super();
  }

  public override onSceneEnter(): Promise<void> {
    const toDungeon = this.addChild(drawText('Go to Dungeon', 'menu', new Point(100, 100), true));
    const toEquipment = this.addChild(drawText('Equipment', 'menu', new Point(100, 200), true));

    // TODO: Market
    // MainScreen.addChild(drawText('Market', 'menu', new Point(100, 300), true));

    this.addChild(drawText('Please note that this is a very early demo. We\'re still working on core mechanics and balancing.', 'inventoryPale', new Point(100, 700)));

    toDungeon.on('click', () => enterDungeon(this.meta.worldLevel));

    toEquipment.on('click', () => {
      Gui.vault.toggle();

      // Clear item preview
      Gui.vault.previewItem(null);
      SelectedSlot.clear();
      Gui.equipment.toggle();
    });

    this.save();

    return Promise.resolve();
  }

  public override onSceneLeave(): Promise<void> {
    Gui.vault.toggle(false);
    Gui.equipment.toggle(false);

    this.save();

    return Promise.resolve();
  }
}
