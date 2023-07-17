import './style.css';

import { initCamera } from './components/Camera';
import { enableResizeEquipment } from './components/graphics/gui/EquipmentGui';
import { initGui } from './components/graphics/gui/Gui';
import { enableResizeInventory, toggleInventoryGui } from './components/graphics/gui/InventoryGui';
import { enableResizeVault } from './components/graphics/gui/VaultGui';
import { state } from './components/State';
import { enterTown } from './components/Town';
import { enableResize } from './components/WindowResize';

import { loadFonts } from './utils/awaitFonts';

// Ensure fonts are loaded
await loadFonts();

// Create a canvas element
document.body.appendChild(state.app.view);

enableResizeInventory(state.app.renderer);
enableResizeEquipment(state.app.renderer);
enableResizeVault(state.app.renderer);
enableResize(state.app.renderer);

state.root = state.app.stage;

// Camera setup
state.camera = initCamera();
state.root.addChild(state.camera);

// GUI setup
state.root.addChild(initGui());

async function setup() {
  document.body.addEventListener('keydown', ((event: KeyboardEvent) => {
    if (event.key === 'i') {
      toggleInventoryGui();
    }
  }));

  // EnterDungeon(state.meta.worldLevel);
  enterTown(state.camera);
}

setup();
