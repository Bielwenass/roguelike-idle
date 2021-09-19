import './style.css';
import * as PIXI from 'pixi.js';
import { IPoint } from 'pixi.js';

import { IActorBase, spawnActor } from './Actors';
import { initCamera } from './Camera';
import { TILE_SIZE } from './constants';
import { initGraphics } from './Graphics';
import {
  ICell,
  generateField,
  updateTiles,
  getRandomTile,
} from './Tiling';

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

// Camera setup
const camera = initCamera();

app.stage.addChild(camera);

// World setup
const world = new PIXI.Container();

camera.addChild(world);

// Player setup
const playerStats = {
  name: 'Player',
  speed: 2,
  sightRange: 4,
} as IActorBase;

const player = spawnActor(
  playerStats,
  texturePlayer,
  world,
  {
    x: 0, y: 0,
  } as IPoint,
);

// Board setup
let playField = generateField(10);

function movePlayerToCell(cell: ICell) {
  player.position = cell.position;
  player.sprite.position = cell.sprite.position;

  updateTiles(player, playField);
}

function spawnEnemies() {
  const enemiesCount = 3;

  const skeletonStats = {
    name: 'Skeleton',
    speed: 1,
    sightRange: 3,
  };

  const enemies = Array.from(Array(enemiesCount)).map(() => {
    let selectedTile = null;

    do {
      selectedTile = getRandomTile(playField);
    } while (!selectedTile.ground);

    return spawnActor(
      skeletonStats,
      textureSkeleton,
      world,
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

      const newTile = world.addChild(newTileSprite);

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

  playField = updateTiles(player, playField);
}

// app.loader.load(setup);
setup();
