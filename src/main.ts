import './style.css';

import { Gui } from '@gui/Gui';
// Need the event system to be included in the bundle for the events to work
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EventSystem } from '@pixi/events';
import { loadFonts } from '@utils/awaitFonts';

import { initCamera } from './components/Camera';
import { state } from './components/State';
import { enterTown } from './components/Town';
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

  document.body.addEventListener('keydown', ((event: KeyboardEvent) => {
    if (event.key === 'i') {
      Gui.backpack.toggle();
    }
  }));

  enterTown(state.camera);
}

setup();
