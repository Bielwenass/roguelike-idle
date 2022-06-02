import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { TileType } from '../data/enums/TileType';

import { Actor } from '../types/Actor';

import { get2dArray } from '../utils/get2dArray';
import getDistance from '../utils/getDistance';

export interface Cell {
  ground: boolean,
  type: TileType,
  sprite: Sprite,
  position: Point,
  seen: boolean,
}

export function getRandomTile(playBoard: Cell[][]): Cell {
  const x = Math.floor(Math.random() * playBoard.length);
  const y = Math.floor(Math.random() * playBoard[x].length);

  return playBoard[x][y];
}

export function getRandomGroundTile(playBoard: Cell[][]): Cell {
  let selectedTile = null;

  do {
    selectedTile = getRandomTile(playBoard);
  } while (!selectedTile.ground);

  return selectedTile;
}

export function generateField(protoBoard: number[][]): Cell[][] {
  const width = protoBoard.length;
  const height = protoBoard[0].length;

  const resultBoard = get2dArray(width, height, {}) as Cell[][];

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      resultBoard[x][y] = {
        ground: protoBoard[x][y] !== 0,
        type: TileType.Default,
        position: new Point(x, y),
        seen: false,
      } as Cell;
    }
  }

  // Select the exit tile
  const exitTile = getRandomGroundTile(resultBoard);

  exitTile.type = TileType.Exit;

  return resultBoard;
}

export function updateTiles(player: Actor, playBoard: Cell[][]): Cell[][] {
  return playBoard.map((e) => e.map((cell) => {
    const dist = getDistance(player.position, cell.position);

    if (dist <= player.sightRange) {
      cell.seen = true;
      cell.sprite.visible = true;
      cell.sprite.alpha = 1;

      if (dist <= player.speed && cell.ground) {
        cell.sprite.tint = 0xffff88;
        cell.sprite.interactive = true;
      } else {
        cell.sprite.tint = 0xffffff;
        cell.sprite.interactive = false;
      }
    } else if (cell.seen) {
      cell.sprite.alpha = 0.5;
    } else {
      cell.sprite.visible = false;
    }

    return cell;
  }));
}
