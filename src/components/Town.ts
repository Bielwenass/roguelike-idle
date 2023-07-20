import { Container, Point } from 'pixi.js';

import { enterDungeon } from './dungeon/Dungeon';
import { Gui } from './graphics/gui/Gui';
import { state } from './State';
import { drawText } from './Text';

export function enterTown(camera: Container) {
  const mainScreen = new Container();

  const toDungeon = mainScreen.addChild(drawText('Go to Dungeon', 'menu', new Point(100, 100), true));
  const toEquipment = mainScreen.addChild(drawText('Equipment', 'menu', new Point(100, 200), true));

  // TODO: Market
  // MainScreen.addChild(drawText('Market', 'menu', new Point(100, 300), true));

  toDungeon.on('click', () => {
    mainScreen.destroy();
    Gui.vault.toggle(false);
    Gui.equipment.toggle(false);
    enterDungeon(state.meta.worldLevel);
  });

  toEquipment.on('click', () => {
    Gui.vault.toggle();
    Gui.equipment.toggle();
  });

  camera.addChild(mainScreen);
}
