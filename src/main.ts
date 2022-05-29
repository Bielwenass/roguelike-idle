import './style.css';
import * as PIXI from 'pixi.js';

import { spawnActor } from './components/Actors';
import { initCamera } from './components/Camera';
import { enterCombat } from './components/Combat';
import { moveEntity, spawnEntity } from './components/Entities';
import { initGraphics } from './components/Graphics';
import { state } from './components/State';
import {
  generateField,
  Cell,
  updateTiles,
  getRandomGroundTile,
} from './components/Tiling';
import { TILE_SIZE } from './constants';
import { creaturePresets } from './data/creaturePresets';
import { CreatureType } from './data/enums/CreatureType';
import { TileType } from './data/enums/TileType';

import { WorldContainer } from './types/WorldContainer';

const outerApp = document.querySelector<HTMLDivElement>('.app-wrapper')!;

outerApp.innerHTML = `
  <div>
    <h1>roguelike-idle</h1>
  </div>
`;

const app = new PIXI.Application();

// Create a canvas element
document.body.appendChild(app.view);

const {
  texturePlayer,
  textureSkeleton,
  textureTile,
  textureWall,
  textureExit,
  textureChest,
} = initGraphics();

state.root = app.stage;

// Camera setup
state.camera = initCamera();
state.root.addChild(state.camera);

// World setup
state.world = new PIXI.Container() as WorldContainer;

// Player setup
state.player = spawnActor(
  state.player,
  state.world,
  texturePlayer,
);

state.camera.addChild(state.world);

state.player.sprite.zIndex = 3;

// Board setup
let playBoard = generateField(10);

async function movePlayerToCell(cell: Cell) {
  moveEntity(state.player, cell.position);

  state.world.enemies.forEach(async (enemy, enemyIdx) => {
    if (enemy.position === state.player.position) {
      const combatResult = await enterCombat(enemy);

      if (combatResult.isWin) {
        state.world.enemies.splice(enemyIdx, 1);
      }
    }
  });

  updateTiles(state.player, playBoard);
}

function spawnEnemies() {
  const enemiesCount = 4;

  state.world.enemies = Array.from(Array(enemiesCount)).map(() => {
    const selectedTile = getRandomGroundTile(playBoard);

    return spawnActor(
      creaturePresets[CreatureType.Skeleton],
      state.world,
      textureSkeleton,
      selectedTile.position,
    );
  });
}

function spawnEntities() {
  playBoard.forEach((cellRow) => {
    cellRow.forEach((cell) => {
      if (cell.type === TileType.Exit) {
        spawnEntity(state.world, textureExit, cell.position);
      }
      if (cell.type === TileType.Chest) {
        spawnEntity(state.world, textureChest, cell.position);
      }
    });
  });
}

function setup() {
  playBoard.forEach((cellRow, x) => {
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

      newTile.on('mousedown', (event) => {
        event.stopPropagation();
        movePlayerToCell(cell);
      });
    });
  });

  spawnEnemies();
  spawnEntities();

  playBoard = updateTiles(state.player, playBoard);
}

setup();
