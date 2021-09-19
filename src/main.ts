import './style.css';
import * as PIXI from 'pixi.js';

import { Actor } from './Actors';
import { initCamera } from './Camera';
import {
  ICell,
  generateField,
  updateTiles,
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

// TODO Look into later
// const TextureCache = PIXI.utils.TextureCache

// Enable zIndex
PIXI.settings.SORTABLE_CHILDREN = true;

const texturePlayer = PIXI.Texture.from('images/player1.png');
const textureTile = PIXI.Texture.from('images/tile.png');

texturePlayer.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
textureTile.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const spritePlayer = new PIXI.Sprite(texturePlayer);
const spriteTile = new PIXI.Sprite(textureTile);

spritePlayer.width = 64;
spritePlayer.height = 64;

spriteTile.width = 64;
spriteTile.height = 64;

let gameState: (delta: number) => void;

function gameLoop(delta: number): void {
  gameState(delta);
}

function play(): void {
  // player.x += delta / 3;
}

// Camera setup
const camera = initCamera();

app.stage.addChild(camera);

// World setup
const world = new PIXI.Container();

camera.addChild(world);

// Player setup
const player = {
  name: 'Player',
  sprite: world.addChild(spritePlayer),
  position: {
    x: 0, y: 0,
  },
  speed: 1,
  sightRange: 4,
} as Actor;

player.sprite.zIndex = 1;

// Board setup
let playField = generateField(10);

function onCellClick(cell: ICell) {
  player.position = cell.position;
  player.sprite.position = cell.sprite.position;

  updateTiles(player, playField);
}

function setup() {
  playField.forEach((cellRow, x) => {
    cellRow.forEach((cell, y) => {
      if (cell.ground) {
        const newTileSprite = new PIXI.Sprite(textureTile);

        newTileSprite.width = 64;
        newTileSprite.height = 64;

        const newTile = world.addChild(newTileSprite);

        newTile.x = x * 66;
        newTile.y = y * 66;

        newTile.interactive = false;
        newTile.visible = false;
        playField[x][y].sprite = newTile;

        newTile.on('mousedown', (event) => {
          event.stopPropagation();
          onCellClick(playField[x][y]);
        });
      }
    });
  });

  playField = updateTiles(player, playField);
  // world.addChild(spriteTile);

  // Set the game state
  gameState = play;

  // Start the game loop
  app.ticker.add((delta) => gameLoop(delta));
}

app.loader.load(setup);
