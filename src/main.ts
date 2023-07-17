import './style.css';
import * as PIXI from 'pixi.js';

import { spawnActor } from './components/Actors';
import { initCamera, centerCameraOn } from './components/Camera';
import { enterCombat } from './components/dungeon/Combat';
import { spawnEnemies } from './components/dungeon/Enemies';
import { updateEntitiesVisibility, spawnEntities } from './components/dungeon/Entities';
import { generateLevel, removeDisconnectedRegions } from './components/dungeon/LevelGeneration';
import {
  moveEntity,
  movePlayer,
  moveActor,
} from './components/dungeon/movement/Movement';
import { selectNextMove } from './components/dungeon/movement/MovementAlgorithm';
import {
  updateTilesVisibility, convertToBoard, tileBoard, getRandomFreeTilePoint,
} from './components/dungeon/Tiling';
import { texturePlayer } from './components/Graphics';
import {
  enableResizeGui,
  getGui,
  updateTempInventory,
  toggleInventoryDisplay,
} from './components/Gui';
import { rollItem } from './components/ItemGeneration';
import { state } from './components/State';
import { enableResize } from './components/WindowResize';
import { ActorType } from './data/enums/ActorType';
import { CombatResult } from './data/enums/CombatResult';
import { DungeonResult } from './data/enums/DungeonResult';
import { EntityType } from './data/enums/EntityType';
import { movements } from './data/movements';

import { Actor } from './types/Actor';
import { Cell } from './types/Cell';
import { WorldContainer } from './types/WorldContainer';

import { getDistance } from './utils/getDistance';
import { timeout } from './utils/timeout';

// Create a canvas element
document.body.appendChild(state.app.view);
enableResizeGui(state.app.renderer);
enableResize(state.app.renderer);

state.root = state.app.stage;

// Camera setup
state.camera = initCamera();
state.root.addChild(state.camera);

// GUI setup
state.root.addChild(getGui());

let worldLevel = 1;

function resetWorld(): void {
  // World setup
  state.world.destroy();
  state.world = new PIXI.Container() as WorldContainer;
  state.camera.x = 0;
  state.camera.y = 0;
  state.camera.addChild(state.world);
}

// Check if we need to start combat to get to the given cell
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

    const newItem = rollItem(worldLevel, 1);

    state.inventory.temp.push(newItem);
    updateTempInventory(state.inventory.temp);
  }

  return false;
}

/* eslint-disable no-await-in-loop */
async function dungeonLoop(): Promise<DungeonResult> {
  while (true) {
    await timeout(5000 / state.player.speed);

    const selectedCell = selectNextMove(state.player, state.world.board);
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

async function enterDungeon(level: number): Promise<void> {
  // Board setup
  const dungeonSize = level + 6;
  let protoBoard = await generateLevel(dungeonSize);

  protoBoard = removeDisconnectedRegions(protoBoard);
  state.world.board = convertToBoard(protoBoard);
  tileBoard(state.world);

  // Player setup
  const playerSpawnTilePoint = getRandomFreeTilePoint();
  const playerSpawnTile = state.world.board[playerSpawnTilePoint.x][playerSpawnTilePoint.y];

  state.player = spawnActor(
    state.player,
    state.world,
    texturePlayer,
    playerSpawnTile.position,
  );

  state.player.sprite.visible = true;
  playerSpawnTile.actor = state.player;
  // TODO: Remove, debug prop
  state.player.movements = [movements.exit, movements.exploring, movements.random];
  centerCameraOn(state.camera, state.player.sprite);

  state.world.board = updateTilesVisibility(state.player, state.world.board);
  state.world.enemies = spawnEnemies(Math.floor(dungeonSize ** 2 / 16), level, state.world);
  state.world.entities = spawnEntities(state.world);
  state.world.entities = updateEntitiesVisibility(state.world.entities);

  // TODO: Add manual control
  const floorResult = await dungeonLoop();

  resetWorld();

  if (floorResult === DungeonResult.EnterDungeon) {
    enterDungeon(worldLevel += 1);
  }
  if (floorResult === DungeonResult.PlayerDeath) {
    // Clear half the inventory on death
    state.inventory.temp.splice(0, state.inventory.temp.length / 2);
    enterDungeon(worldLevel = 1);
  }
}

async function setup() {
  document.body.addEventListener('keydown', ((event: KeyboardEvent) => {
    if (event.key === 'i') {
      toggleInventoryDisplay();
    }
  }));

  resetWorld();
  await enterDungeon(worldLevel);
}

setup();
