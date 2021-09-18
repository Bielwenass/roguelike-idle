import './style.css';
import * as PIXI from 'pixi.js';

import { initCamera } from './Camera';
import { generateField } from './Tiling';

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

const texture = PIXI.Texture.from('images/player1.png');
const textureTile = PIXI.Texture.from('images/dungeon_tile.png');

texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
textureTile.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const sprite = new PIXI.Sprite(texture);
const spriteTile = new PIXI.Sprite(textureTile);

sprite.width = 64;
sprite.height = 64;

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
const player = world.addChild(sprite);

player.zIndex = 1;

function onCellClick(this: PIXI.Sprite, event: Event) {
  event.stopPropagation();
  player.position = this.position;
}

function setup() {
  // Board setup
  const playField = generateField(10);

  playField.forEach((cellRow, x) => {
    cellRow.forEach((cell, y) => {
      if (cell.ground) {
        const newTileSprite = new PIXI.Sprite(textureTile);

        newTileSprite.width = 64;
        newTileSprite.height = 64;

        const newTile = world.addChild(newTileSprite);

        newTile.x = x * 68;
        newTile.y = y * 68;

        newTile.interactive = true;
        newTile.on('mousedown', onCellClick);
        playField[x][y].sprite = newTile;
      }
    });
  });
  world.addChild(spriteTile);

  // Set the game state
  gameState = play;

  // Start the game loop
  app.ticker.add((delta) => gameLoop(delta));
}

app.loader.load(setup);
