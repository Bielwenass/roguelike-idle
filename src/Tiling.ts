import { IPoint } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { IActor } from './Actors';

import getDistance from './utils/getDistance';

export interface ICell {
  ground: boolean,
  sprite: Sprite,
  position: IPoint,
}

export function generateField(size: number): ICell[][] {
  const resultArr = [] as ICell[][];

  for (let i = 0; i < size; i += 1) {
    resultArr[i] = [] as ICell[];

    for (let k = 0; k < size; k += 1) {
      resultArr[i][k] = {
        ground: Math.random() > 0.35,
        position: {
          x: i, y: k,
        },
      } as ICell;
    }
  }

  return resultArr;
}

export function updateTiles(player: IActor, playBoard: ICell[][]): ICell[][] {
  return playBoard.map((e) => e.map((cell) => {
    const dist = getDistance(player.position, cell.position);

    if (dist <= player.sightRange) {
      cell.sprite.visible = true;

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

export function getRandomTile(playBoard: ICell[][]): ICell {
  const x = Math.floor(Math.random() * playBoard.length);
  const y = Math.floor(Math.random() * playBoard[x].length);

  return playBoard[x][y];
}
