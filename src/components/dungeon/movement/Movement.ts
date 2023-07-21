import { pointToCell } from '@utils/board/pointToCell';

import { TILE_SIZE } from '../../../constants';
import { centerCameraOn } from '../../Camera';

import type { Point } from '@pixi/core';
import type { Container } from '@pixi/display';
import type { Actor } from '@type/Actor';
import type { Cell } from '@type/Cell';
import type { Entity } from '@type/Entity';
import type { PlayBoard } from '@type/PlayBoard';

export function moveEntity(entity: Entity, point: Point): void {
  entity.position = point;

  entity.sprite.x = point.x * TILE_SIZE;
  entity.sprite.y = point.y * TILE_SIZE;
}
export function moveActor(actor: Actor, newPosition: Point, pb: PlayBoard): void {
  pointToCell(actor.position, pb).actor = null;
  pointToCell(newPosition, pb).actor = actor;
  moveEntity(actor, newPosition);
}

export function movePlayer(
  player: Actor,
  cell: Cell,
  pb: PlayBoard,
  camera: Container,
): void {
  moveActor(player, cell.position, pb);
  player.lastCells.unshift(cell);
  player.lastCells.pop();
  centerCameraOn(camera, player.sprite);
}
