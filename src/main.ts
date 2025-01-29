import './style.css';

import { Gui } from '@gui/Gui';
import { Assets } from 'pixi.js';

import { initCamera } from './components/Camera';
import { state } from './components/State';
import { enterTown } from './components/Town';
import { enableResize } from './components/WindowResize';

/**
 * Initializes the application setup by creating necessary elements and loading assets.
 * This function performs the following tasks:
 * - Appends a canvas element to the document body.
 * - Enables resizing for the application renderer.
 * - Loads required font assets asynchronously.
 * - Initializes the camera and adds it to the application stage.
 * - Sets up the GUI and adds it to the application stage.
 * - Listens for keyboard events to toggle the backpack GUI when the 'i' key is pressed.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the setup is complete.
 *
 * @throws {Error} Throws an error if asset loading fails.
 *
 * @example
 * setup().then(() => {
 *   console.log('Setup complete');
 * }).catch((error) => {
 *   console.error('Setup failed:', error);
 * });
 */
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
    antialias: false,
  });

  setup();
})();
