import './style.css';

import '@pixi/events';
import { Gui } from '@gui/Gui';
import { loadFonts } from '@utils/awaitFonts';

import { initCamera } from './components/Camera';
import { state } from './components/State';
import { enableResize } from './components/WindowResize';

async function setup() {
  // Create a canvas element
  document.body.appendChild(state.app.view);
  enableResize(state.app.renderer);

  state.root = state.app.stage;

  // Camera setup
  state.camera = initCamera();
  state.root.addChild(state.camera);

  // Ensure fonts are loaded
  await loadFonts();

  // GUI setup
  state.root.addChild(Gui.getInstance());

  state.root.addChild(state.scene);
  state.scene.addChild(state.scene.manager);

  document.body.addEventListener('keydown', ((event: KeyboardEvent) => {
    if (event.key === 'i') {
      Gui.backpack.toggle();
    }
  }));

  await state.scene.gotoTown();
}

await setup();
