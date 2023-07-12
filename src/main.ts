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
import { initGraphics } from './components/Graphics';
import {
  updateGui, getGui, toggleInventoryDisplay, enableResizeGui,
} from './components/Gui';
import { rollItem } from './components/ItemGeneration';
import { generateLevel, removeDisconnectedRegions } from './components/LevelGeneration';
import { selectNextMove } from './components/Movement';
import { state } from './components/State';
import {
  convertToBoard,
  updateTiles,
  getRandomGroundTile,
} from './components/Tiling';
import { enableResize } from './components/WindowResize';
import { TILE_SIZE } from './constants';
import { creaturePresets } from './data/creaturePresets';
import { CombatResult } from './data/enums/CombatResult';
import { CreatureType } from './data/enums/CreatureType';
import { EntityType } from './data/enums/EntityType';

import { Actor } from './types/Actor';
import { Cell } from './types/Cell';
import { Entity } from './types/Entity';
import { WorldContainer } from './types/WorldContainer';

import { timeout } from './utils/delay';

// Create a canvas element
document.body.appendChild(state.app.view);
enableResizeGui(state.app.renderer);
enableResize(state.app.renderer);

const {
  texturePlayer,
  textureSkeleton,
  textureTile,
  textureWall,
  textureExit,
  textureChest,
} = initGraphics();

state.root = state.app.stage;

// Camera setup
state.camera = initCamera();
state.root.addChild(state.camera);

// GUI setup
state.root.addChild(getGui());

// World setup
state.world = new PIXI.Container() as WorldContainer;
state.camera.addChild(state.world);

// Board setup
let protoBoard = await generateLevel(16, 16);

protoBoard = removeDisconnectedRegions(protoBoard);
state.world.board = convertToBoard(protoBoard);

const isAutoMovement = true;

async function movePlayerToCell(cell: Cell) {
  moveEntity(state.player, cell.position);
  const combatResult = await combatCheck();

  if (combatResult === CombatResult.Won) {
    const newItem = rollItem(1, 1);

    state.inventory.temp.push(newItem);
    updateGui(state.inventory.temp);
  }

  centerCameraOn(state.camera, state.player.sprite, state.app.screen);

  state.world.board = updateTiles(state.player, state.world.board);
  state.world.entities = updateEntities(state.world.entities, state.player);
  state.world.enemies = updateEntities(state.world.enemies, state.player) as Actor[];

  if (isAutoMovement) {
    await timeout(5000 / state.player.speed);
    movePlayerToCell(selectNextMove(state.player, state.world.board));
  }
}

function spawnEnemies() {
  const enemiesCount = 64;

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

function setup() {
  for (const [x, cellRow] of state.world.board.entries()) {
    for (const [y, cell] of cellRow.entries()) {
      let newTileSprite;

      if (cell.isGround) {
        newTileSprite = new PIXI.Sprite(textureTile);
      } else {
        newTileSprite = new PIXI.Sprite(textureWall);
      }

      newTileSprite.width = TILE_SIZE;
      newTileSprite.height = TILE_SIZE;

      const newTile = state.world.addChild(newTileSprite);

      newTile.x = x * TILE_SIZE;
      newTile.y = y * TILE_SIZE;

      newTile.interactive = false;
      newTile.visible = false;
      cell.sprite = newTile;

      if (!isAutoMovement) {
        newTile.on('mousedown', (event) => {
          event.stopPropagation();
          movePlayerToCell(cell);
        });
      }
    }
  }

  document.body.addEventListener('keydown', ((event: KeyboardEvent) => {
    if (event.key === 'i') {
      toggleInventoryDisplay();
    }
  }));

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
    movePlayerToCell(selectNextMove(state.player, state.world.board));
  }
}

setup();
