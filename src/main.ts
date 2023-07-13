import './style.css';
import * as PIXI from 'pixi.js';

import { spawnActor } from './components/Actors';
import { centerCameraOn, initCamera } from './components/Camera';
import { combatCheck } from './components/Combat';
import {
  moveEntity,
  spawnEntity,
  updateEntities,
} from './components/Entities';
import {
  texturePlayer,
  textureSkeleton,
  textureExit,
  textureChest,
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
  updateTiles,
  getRandomGroundTile,
  tileBoard,
} from './components/Tiling';
import { enableResize } from './components/WindowResize';
import { creaturePresets } from './data/creaturePresets';
import { CombatResult } from './data/enums/CombatResult';
import { CreatureType } from './data/enums/CreatureType';
import { EntityType } from './data/enums/EntityType';

import { Actor } from './types/Actor';
import { Cell } from './types/Cell';
import { Entity } from './types/Entity';
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

function spawnEnemies() {
  const enemiesCount = 16;

  state.world.enemies = Array(enemiesCount).fill(null).map(() => {
    const selectedTile = getRandomGroundTile(state.world.board, true);

    selectedTile.hasActor = true;

    return spawnActor(
      creaturePresets[CreatureType.Skeleton],
      state.world,
      textureSkeleton,
      selectedTile.position,
    );
  });

  state.world.enemies = updateEntities(state.world.enemies, state.player) as Actor[];
}

function spawnEntities() {
  state.world.entities = [];

  for (const cellRow of state.world.board) {
    for (const cell of cellRow) {
      if (cell.entityType === EntityType.Exit) {
        state.world.entities.push(spawnEntity(state.world, textureExit, cell.position));
      }
      if (cell.entityType === EntityType.Chest) {
        state.world.entities.push(spawnEntity(state.world, textureChest, cell.position));
      }
    }
  }

  state.world.entities = updateEntities(state.world.entities, state.player) as Entity[];
}

function resetWorld() {
  // World setup
  state.world.destroy();
  state.world = new PIXI.Container() as WorldContainer;
  state.camera.addChild(state.world);
}

async function enterDungeon() {
  // Board setup
  let protoBoard = await generateLevel(16, 16);

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
  const playerSpawnTile = getRandomGroundTile(state.world.board);

  playerSpawnTile.hasActor = true;

  state.player = spawnActor(
    state.player,
    state.world,
    texturePlayer,
    playerSpawnTile.position,
  );
  state.player.sprite.visible = true;
  centerCameraOn(state.camera, state.player.sprite, state.app.screen);

  spawnEnemies();
  spawnEntities();

  state.world.board = updateTiles(state.player, state.world.board);

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
    const newItem = rollItem(1, 1);

    state.inventory.temp.push(newItem);
    updateTempInventory(state.inventory.temp);
  }

  centerCameraOn(state.camera, state.player.sprite, state.app.screen);

  if (cell.entityType === EntityType.Exit) {
    resetWorld();
    enterDungeon();
    state.camera.position.x = 0;
    state.camera.position.y = 0;

    return;
  }

  state.world.board = updateTiles(state.player, state.world.board);
  state.world.entities = updateEntities(state.world.entities, state.player);
  state.world.enemies = updateEntities(state.world.enemies, state.player) as Actor[];

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
  await enterDungeon();
}

setup();
