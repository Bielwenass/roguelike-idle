import './style.css';
import * as PIXI from 'pixi.js';

import { spawnActor } from './components/Actors';
import { centerCameraOn, initCamera } from './components/Camera';
import { combatCheck } from './components/Combat';
import {
  moveEntity,
  spawnEntities,
  updateEntitiesVisibility,
} from './components/Entities';
import {
  texturePlayer,
  textureSkeleton,
} from './components/Graphics';
import {
  updateTempInventory, getGui, toggleInventoryDisplay, enableResizeGui,
} from './components/Gui';
import { rollItem } from './components/ItemGeneration';
import { generateLevel, removeDisconnectedRegions } from './components/LevelGeneration';
import { selectNextMove } from './components/Movement';
import { state } from './components/State';
import {
  convertToBoard,
  updateTilesVisibility,
  tileBoard,
  getRandomFreeTilePoint,
} from './components/Tiling';
import { enableResize } from './components/WindowResize';
import { creaturePresets } from './data/creaturePresets';
import { CombatResult } from './data/enums/CombatResult';
import { CreatureType } from './data/enums/CreatureType';
import { EntityType } from './data/enums/EntityType';

import { Actor } from './types/Actor';
import { Cell } from './types/Cell';
import { WorldContainer } from './types/WorldContainer';

import { flatten } from './utils/flatten';
import { timeout } from './utils/timeout';

// Create a canvas element
document.body.appendChild(state.app.view);
enableResizeGui(state.app.renderer);
enableResize(state.app.renderer);

state.root = state.app.stage;

// Camera setup
state.camera = initCamera();
state.root.addChild(state.camera);

// GUI setup
state.root.addChild(getGui());

const isAutoMovement = true;
let worldLevel = 1;

function spawnEnemies(count: number): Actor[] {
  state.world.enemies = Array(count).fill(null).map(() => {
    const selectedTilePoint = getRandomFreeTilePoint();
    const selectedTile = state.world.board[selectedTilePoint.x][selectedTilePoint.y];

    selectedTile.hasActor = true;

    return spawnActor(
      creaturePresets[CreatureType.Skeleton],
      state.world,
      textureSkeleton,
      selectedTile.position,
    );
  });

  return updateEntitiesVisibility(state.world.enemies, state.player) as Actor[];
}

function resetWorld(): void {
  // World setup
  state.world.destroy();
  state.world = new PIXI.Container() as WorldContainer;
  state.camera.addChild(state.world);
}

async function enterDungeon(level: number): Promise<void> {
  // Board setup
  let protoBoard = await generateLevel(level + 6, level + 6);

  protoBoard = removeDisconnectedRegions(protoBoard);
  state.world.board = convertToBoard(protoBoard);
  tileBoard(state.world);

  if (!isAutoMovement) {
    for (const tile of flatten(state.world.board)) {
      tile.sprite.on('mousedown', (event) => {
        event.stopPropagation();
        movePlayerToCell(tile);
      });
    }
  }

  // Player setup
  const playerSpawnTilePoint = getRandomFreeTilePoint();
  const playerSpawnTile = state.world.board[playerSpawnTilePoint.x][playerSpawnTilePoint.y];

  playerSpawnTile.hasActor = true;

  state.player = spawnActor(
    state.player,
    state.world,
    texturePlayer,
    playerSpawnTile.position,
  );
  state.player.sprite.visible = true;
  centerCameraOn(state.camera, state.player.sprite, state.app.screen);

  state.world.enemies = spawnEnemies(level * 2 + 4);
  state.world.entities = spawnEntities(state.world);
  state.world.entities = updateEntitiesVisibility(state.world.entities, state.player);
  state.world.board = updateTilesVisibility(state.player, state.world.board);

  if (isAutoMovement) {
    await timeout(2000);
    movePlayerToCell(selectNextMove(state.player, state.world.board));
  }
}

async function movePlayerToCell(cell: Cell) {
  moveEntity(state.player, cell.position);
  state.player.lastCells.unshift(cell);
  state.player.lastCells.pop();
  const combatResult = await combatCheck();

  if (combatResult === CombatResult.Won) {
    const newItem = rollItem(worldLevel, 1);

    state.inventory.temp.push(newItem);
    updateTempInventory(state.inventory.temp);
  }

  centerCameraOn(state.camera, state.player.sprite, state.app.screen);

  if (cell.entityType === EntityType.Exit) {
    resetWorld();
    enterDungeon(worldLevel += 1);
    state.camera.position.x = 0;
    state.camera.position.y = 0;

    return;
  }

  state.world.board = updateTilesVisibility(state.player, state.world.board);
  state.world.entities = updateEntitiesVisibility(state.world.entities, state.player);
  state.world.enemies = updateEntitiesVisibility(state.world.enemies, state.player) as Actor[];

  if (isAutoMovement) {
    await timeout(5000 / state.player.speed);
    movePlayerToCell(selectNextMove(state.player, state.world.board));
  }
}

async function setup() {
  document.body.addEventListener('keydown', ((event: KeyboardEvent) => {
    if (event.key === 'i') {
      toggleInventoryDisplay();
    }
  }));

  resetWorld();
  await enterDungeon(worldLevel);
}

setup();
