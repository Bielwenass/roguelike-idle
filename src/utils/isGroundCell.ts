import type { PlayBoard } from '@type/PlayBoard';

export function isGroundCell(x: number, y: number, playBoard: PlayBoard): boolean {
  const cellExists = playBoard[x] && playBoard[x][y] !== undefined;

  return cellExists && playBoard[x][y].isGround;
}
