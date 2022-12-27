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
import { generateLevel, removeDisconnectedRegions } from './components/Generation';
import { initGraphics } from './components/Graphics';
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
import { CreatureType } from './data/enums/CreatureType';
import { TileType } from './data/enums/TileType';

import { Actor } from './types/Actor';
import { Cell } from './types/Cell';
import { Entity } from './types/Entity';
import { WorldContainer } from './types/WorldContainer';

import { timeout } from './utils/delay';

// Create a canvas element
document.body.appendChild(state.app.view);
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

// World setup
state.world = new PIXI.Container() as WorldContainer;
state.camera.addChild(state.world);

// Board setup
let protoBoard = await generateLevel(16, 16);

protoBoard = removeDisconnectedRegions(protoBoard);
state.world.board = convertToBoard(protoBoard);

const isAutoMovement = false;

async function movePlayerToCell(cell: Cell) {
  moveEntity(state.player, cell.position);
  await combatCheck();
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
  const enemiesCount = 16;

  state.world.enemies = Array.from(Array(enemiesCount)).map(() => spawnActor(
    creaturePresets[CreatureType.Skeleton],
    state.world,
    textureSkeleton,
    getRandomGroundTile(state.world.board).position,
  ));

  state.world.enemies = updateEntities(state.world.enemies, state.player) as Actor[];
}

function spawnEntities() {
  state.world.entities = [];

  state.world.board.forEach((cellRow) => {
    cellRow.forEach((cell) => {
      if (cell.type === TileType.Exit) {
        state.world.entities.push(spawnEntity(state.world, textureExit, cell.position));
      }
      if (cell.type === TileType.Chest) {
        state.world.entities.push(spawnEntity(state.world, textureChest, cell.position));
      }
    });
  });

  state.world.entities = updateEntities(state.world.entities, state.player) as Entity[];
}

function setup() {
  state.world.board.forEach((cellRow, x) => {
    cellRow.forEach((cell, y) => {
      let newTileSprite;

      if (cell.ground) {
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
    });
  });

  // Player setup
  state.player = spawnActor(
    state.player,
    state.world,
    texturePlayer,
    getRandomGroundTile(state.world.board).position,
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
