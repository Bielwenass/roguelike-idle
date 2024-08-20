import { ActorType } from '@data/enums/ActorType';
import { CombatResult } from '@data/enums/CombatResult';
import { DungeonResult } from '@data/enums/DungeonResult';
import { EntityType } from '@data/enums/EntityType';
import { movements } from '@data/movements';
import { pointToCell } from '@utils/board/pointToCell';
import { getDistance } from '@utils/getDistance';
import { sumPoints } from '@utils/sumPoints';
import { timeout } from '@utils/timeout';
import { Container } from 'pixi.js';

import { enterCombat } from './Combat';
import { spawnEnemies } from './Enemies';
import { updateEntitiesVisibility, spawnEntities } from './Entities';
import { generateLevel, removeDisconnectedRegions } from './LevelGeneration';
import { ManualMovement } from './movement/ManualMovement';
import {
  moveEntity, movePlayer, moveActor,
} from './movement/Movement';
import { selectNextMove } from './movement/MovementAlgorithm';
import {
  updateTilesVisibility, convertToBoard, tileBoard, getRandomFreeTilePoint,
} from './Tiling';
import { DEBUG_MOVEMENT } from '../../constants';
import { spawnActor } from '../Actors';
import { centerCameraOn } from '../Camera';
import { texturePlayer } from '../graphics/Graphics';
import {
  addToBackpack, loseItemsOnDeath, stashToVault,
} from '../Inventory';
import { rollItem } from '../ItemGeneration';
import { state } from '../State';
import { enterTown } from '../Town';

import type { Actor } from '@type/Actor';
import type { Cell } from '@type/Cell';
import type { WorldContainer } from '@type/WorldContainer';

// Check if we need to start combat to move to the given cell
// If yes, start combat
export async function combatCheck(movingActor: Actor, cell: Cell): Promise<CombatResult> {
  if (cell.actor && cell.actor.type !== movingActor.type) {
    const winner = await enterCombat(movingActor, cell.actor);

    if (winner.type === ActorType.Player) {
      state.player = winner;
      // Refresh player sprite
      moveEntity(state.player, state.player.position);

      return CombatResult.Won;
    }

    return CombatResult.Lost;
  }

  return CombatResult.DidNotFight;
}

function processCombatResult(combatResult: CombatResult, enemy: Actor | null): boolean {
  if (combatResult === CombatResult.Lost) {
    return true;
  } if (combatResult === CombatResult.Won) {
    state.world.enemies.splice(state.world.enemies.findIndex((e) => e.position === enemy!.position), 1);

    const newItem = rollItem(state.meta.worldLevel, 1);

    addToBackpack(newItem);
  }

  return false;
}

/* eslint-disable no-await-in-loop */
async function dungeonLoop(): Promise<DungeonResult> {
  while (true) {
    let selectedCell;

    if (DEBUG_MOVEMENT) {
      const move = await ManualMovement.waitForKeypress();

      selectedCell = pointToCell(sumPoints(state.player.position, move), state.world.board);
    } else {
      await timeout(5000 / state.player.speed);
      selectedCell = selectNextMove(state.player, state.world.board);
    }

    const combatResult = await combatCheck(state.player, selectedCell);

    if (processCombatResult(combatResult, selectedCell.actor)) {
      return DungeonResult.PlayerDeath;
    }

    movePlayer(state.player, selectedCell, state.world.board, state.camera);

    // Exit to next dungeon floor
    if (selectedCell.entityType === EntityType.Exit) {
      return DungeonResult.EnterDungeon;
    }

    state.world.board = updateTilesVisibility(state.player, state.world.board);
    state.world.entities = updateEntitiesVisibility(state.world.entities);
    state.world.enemies = updateEntitiesVisibility(state.world.enemies) as Actor[];

    // Basic enemies movement
    // With sorting we solve the problem where farther enemies can't
    // Move while the near ones haven't made a move yet
    for (const enemy of state.world.enemies.sort(
      (a, b) => getDistance(state.player.position, a.position) - getDistance(state.player.position, b.position),
    )) {
      if (getDistance(state.player.position, enemy.position) < state.player.sightRange) {
        await timeout(30);
      }

      // Micro optimization: don't try to find the player if the distance is too great
      if (getDistance(enemy.position, state.player.position) > enemy.sightRange) {
        enemy.movements = [movements.random];
      } else {
        enemy.movements = [movements.player, movements.random];
      }

      const selectedEnemyCell = selectNextMove(enemy, state.world.board);
      const enemyCombatResult = await combatCheck(enemy, selectedEnemyCell);

      if (processCombatResult(enemyCombatResult, enemy)) {
        return DungeonResult.PlayerDeath;
      }

      moveActor(enemy, selectedEnemyCell.position, state.world.board);
    }

    state.world.enemies = updateEntitiesVisibility(state.world.enemies) as Actor[];
  }
}
/* eslint-enable no-await-in-loop */

function resetWorld(): void {
  // World setup
  state.world.destroy();
  state.world = new Container() as WorldContainer;
  state.camera.x = 0;
  state.camera.y = 0;
  state.camera.addChild(state.world);
}

export async function enterDungeon(level: number): Promise<void> {
  resetWorld();

  // Board setup
  const dungeonSize = level + 6;
  let protoBoard = await generateLevel(dungeonSize);

  protoBoard = removeDisconnectedRegions(protoBoard);
  state.world.board = convertToBoard(protoBoard);
  tileBoard(state.world);

  // Player setup
  const playerSpawnTilePoint = getRandomFreeTilePoint();
  const playerSpawnTile = pointToCell(playerSpawnTilePoint, state.world.board);

  state.player = {
    ...spawnActor(
      state.player,
      state.world,
      texturePlayer,
      playerSpawnTile.position,
    ),
    // Preserve hp across floors
    currentHealth: state.player.currentHealth,
  };
  // Update hpBar
  state.player.hpBar.set(state.player.currentHealth / state.player.maxHealth);

  state.player.sprite.visible = true;
  playerSpawnTile.actor = state.player;
  centerCameraOn(state.camera, state.player.sprite);

  // TODO: Remove, debug prop
  state.player.movements = [movements.exit, movements.exploring, movements.random];

  state.world.board = updateTilesVisibility(state.player, state.world.board);
  state.world.enemies = spawnEnemies(Math.floor(dungeonSize ** 2 / 16), level, state.world);
  state.world.entities = spawnEntities(state.world);
  state.world.entities = updateEntitiesVisibility(state.world.entities);

  if (DEBUG_MOVEMENT) {
    ManualMovement.getInstance();
  }
  const floorResult = await dungeonLoop();

  resetWorld();

  if (floorResult === DungeonResult.EnterDungeon) {
    enterDungeon(state.meta.worldLevel += 1);
  }
  if (floorResult === DungeonResult.PlayerDeath) {
    loseItemsOnDeath(state.inventory.backpack);
    stashToVault();
    state.player.currentHealth = state.player.maxHealth;
    enterTown();
  }
  if (floorResult === DungeonResult.ExitToTown) {
    stashToVault();
    state.player.currentHealth = state.player.maxHealth;
    enterTown();
  }
}
