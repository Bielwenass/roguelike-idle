import './style.css';

import { initCamera } from './components/Camera';
import { Gui } from './components/graphics/gui/Gui';
import { state } from './components/State';
import { enterTown } from './components/Town';
import { enableResize } from './components/WindowResize';

import { loadFonts } from './utils/awaitFonts';

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

  document.body.addEventListener('keydown', ((event: KeyboardEvent) => {
    if (event.key === 'i') {
      Gui.backpack.toggle();
    }
  }));

  enterTown(state.camera);
}

setup();
