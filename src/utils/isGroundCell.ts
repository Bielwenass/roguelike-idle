import { Cell } from '../types/Cell';

export function isGroundCell(x: number, y: number, playBoard: Cell[][]): boolean {
  const cellExists = playBoard[x] && playBoard[x][y] !== undefined;

  if (!cellExists) {
    return false;
  }

  return playBoard[x][y].ground;
}
