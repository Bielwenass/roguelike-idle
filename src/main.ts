import './style.css';
import * as PIXI from 'pixi.js';

import { spawnActor } from './components/Actors';
import { initCamera } from './components/Camera';
import { enterCombat } from './components/Combat';
import { initGraphics } from './components/Graphics';
import { state } from './components/State';
import {
  generateField,
  Cell,
  updateTiles,
  getRandomTile,
} from './components/Tiling';
import { TILE_SIZE } from './constants';
import { creaturePresets } from './data/creaturePresets';
import { CreatureType } from './data/enums/CreatureType';

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
} = initGraphics();

state.root = app.stage;

// Camera setup
state.camera = initCamera();
state.root.addChild(state.camera);

// World setup
state.world = new PIXI.Container();

// Player setup
state.player.texture = texturePlayer;

state.player = spawnActor(
  state.player,
  state.world,
  texturePlayer,
);

state.camera.addChild(state.world);

state.player.sprite.zIndex = 3;

// Board setup
let playField = generateField(10);

function movePlayerToCell(cell: Cell) {
  state.player.position = cell.position;
  state.player.sprite.position = cell.sprite.position;

  state.enemies.forEach(async (enemy) => {
    if (enemy.position === state.player.position) {
      const combatResult = await enterCombat(enemy);

      console.log(combatResult);
    }
  });

  updateTiles(state.player, playField);
}

function spawnEnemies() {
  const enemiesCount = 3;

  state.enemies = Array.from(Array(enemiesCount)).map(() => {
    let selectedTile = null;

    do {
      selectedTile = getRandomTile(playField);
    } while (!selectedTile.ground);

    return spawnActor(
      creaturePresets[CreatureType.Skeleton],
      state.world,
      textureSkeleton,
      selectedTile.position,
    );
  });
}

function setup() {
  playField.forEach((cellRow, x) => {
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
      playField[x][y].sprite = newTile;

      newTile.on('mousedown', (event) => {
        event.stopPropagation();
        movePlayerToCell(playField[x][y]);
      });
    });
  });

  spawnEnemies();

  playField = updateTiles(state.player, playField);
}

setup();
