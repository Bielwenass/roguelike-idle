import './style.css';

import { Gui } from '@gui/Gui';
import { Assets } from 'pixi.js';

import { initCamera } from './components/Camera';
import { state } from './components/State';
import { enterTown } from './components/Town';
import { enableResize } from './components/WindowResize';

async function setup() {
  // Create a canvas element
  document.body.appendChild(state.app.canvas);
  enableResize(state.app.renderer);

  // Ensure fonts are loaded
  await Assets.load('bitmgothic.medium.ttf');
  await Assets.load('timetwist.regular.ttf');

  state.root = state.app.stage;

  // Camera setup
  state.camera = initCamera();
  state.root.addChild(state.camera);

  // GUI setup
  state.root.addChild(Gui.getInstance());

  document.body.addEventListener('keydown', ((event: KeyboardEvent) => {
    if (event.key === 'i') {
      Gui.backpack.toggle();
    }
  }));

  enterTown();
}

(async () => {
  await state.app.init({
    roundPixels: true,
  });

  setup();
})();
