import { enterDungeon } from '@dungeon/Dungeon';
import { Gui } from '@gui/Gui';
import { SelectedSlot } from '@gui/SelectedSlot';
import { Container, Point } from 'pixi.js';

import { saveState } from './SaveManagement';
import { state } from './State';
import { drawText } from './Text';

export function enterTown() {
  const mainScreen = new Container();

  const toDungeon = mainScreen.addChild(drawText('Enter Dungeon', 'menu', new Point(100, 100), true));
  const toEquipment = mainScreen.addChild(drawText('Equipment', 'menu', new Point(100, 200), true));

  // TODO: Market
  // MainScreen.addChild(drawText('Market', 'menu', new Point(100, 300), true));

  mainScreen.addChild(drawText('Please note that this is a very early demo. We\'re still working on core mechanics and balancing.', 'inventoryPale', new Point(100, 700)));

  toDungeon.onclick = () => {
    mainScreen.destroy();
    Gui.vault.toggle(false);
    Gui.equipment.toggle(false);

    saveState(state);
    mainScreen.destroy();
    enterDungeon(state.meta.worldLevel);
  };

  toEquipment.onclick = () => {
    Gui.vault.toggle();

    // Clear item preview
    Gui.vault.previewItem(null);
    SelectedSlot.clear();
    Gui.equipment.toggle();
  };

  // Updating GUI in case we just loaded
  Gui.equipment.updateSlots();
  Gui.vault.updateSlots();

  saveState(state);
  state.root.addChildAt(mainScreen, 0);
}
