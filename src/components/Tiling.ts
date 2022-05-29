import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { TileType } from '../data/enums/TileType';

import { Actor } from '../types/Actor';

import getDistance from '../utils/getDistance';

export interface Cell {
  ground: boolean,
  type: TileType,
  sprite: Sprite,
  position: Point,
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

export function generateField(size: number): Cell[][] {
  const resultBoard = [] as Cell[][];

  for (let i = 0; i < size; i += 1) {
    resultBoard[i] = [] as Cell[];

    for (let k = 0; k < size; k += 1) {
      resultBoard[i][k] = {
        ground: Math.random() > 0.35,
        position: new Point(i, k),
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
      cell.sprite.visible = true;
      // cell.sprite.alpha = 0.5;

      if (dist <= player.speed && cell.ground) {
        cell.sprite.tint = 0xffff88;
        cell.sprite.interactive = true;
      } else {
        cell.sprite.tint = 0xffffff;
        cell.sprite.interactive = false;
      }
    } else {
      cell.sprite.visible = false;
    }

    return cell;
  }));
}
