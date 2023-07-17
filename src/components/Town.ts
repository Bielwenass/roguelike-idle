import { Container, Point } from 'pixi.js';

import { enterDungeon } from './dungeon/Dungeon';
import { toggleEquipmentGui } from './graphics/gui/EquipmentGui';
import { toggleVaultGui, updateVaultGui } from './graphics/gui/VaultGui';
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
    toggleVaultGui(false);
    toggleEquipmentGui(false);
    enterDungeon(state.meta.worldLevel);
  });

  toEquipment.on('click', () => {
    toggleVaultGui();
    updateVaultGui(state.inventory.vault);
    toggleEquipmentGui();
  });

  camera.addChild(mainScreen);
}
