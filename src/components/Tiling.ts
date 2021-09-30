import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { Actor } from '../types/Actor';

import getDistance from '../utils/getDistance';

export interface Cell {
  ground: boolean,
  sprite: Sprite,
  position: Point,
}

export function generateField(size: number): Cell[][] {
  const resultArr = [] as Cell[][];

  for (let i = 0; i < size; i += 1) {
    resultArr[i] = [] as Cell[];

    for (let k = 0; k < size; k += 1) {
      resultArr[i][k] = {
        ground: Math.random() > 0.35,
        position: {
          x: i, y: k,
        },
      } as Cell;
    }
  }

  return resultArr;
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

export function getRandomTile(playBoard: Cell[][]): Cell {
  const x = Math.floor(Math.random() * playBoard.length);
  const y = Math.floor(Math.random() * playBoard[x].length);

  return playBoard[x][y];
}
