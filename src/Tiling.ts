import { Sprite } from '@pixi/sprite';

export interface ICell {
  ground: boolean,
  sprite: Sprite,
}

export const generateField = (size: number): ICell[][] => {
  const resultArr = [] as ICell[][];

  for (let i = 0; i < size; i += 1) {
    resultArr[i] = [] as ICell[];

    for (let k = 0; k < size; k += 1) {
      resultArr[i][k] = {
        ground: Math.random() > 0.35,
      } as ICell;
    }
  }

  return resultArr;
};
