import './style.css';
import * as PIXI from 'pixi.js';

import { spawnActor } from './components/Actors';
import { centerCameraOn, initCamera } from './components/Camera';
import { combatCheck } from './components/Combat';
import {
  moveActorOnBoard,
  moveEntity,
  spawnEntities,
  updateEntitiesVisibility,
} from './components/Entities';
import {
  texturePlayer,
  textureSkeleton,
} from './components/Graphics';
import {
  updateTempInventory, getGui, toggleInventoryDisplay, enableResizeGui,
} from './components/Gui';
import { rollItem } from './components/ItemGeneration';
import { generateLevel, removeDisconnectedRegions } from './components/LevelGeneration';
import { selectNextMove } from './components/Movement';
import { state } from './components/State';
import {
  convertToBoard,
  updateTilesVisibility,
  tileBoard,
  getRandomFreeTilePoint,
} from './components/Tiling';
import { enableResize } from './components/WindowResize';
import { creaturePresets } from './data/creaturePresets';
import { ActorType } from './data/enums/ActorType';
import { CombatResult } from './data/enums/CombatResult';
import { CreatureType } from './data/enums/CreatureType';
import { EntityType } from './data/enums/EntityType';
import { MoveResult } from './data/enums/MoveResult';
import { movements } from './data/movements';

import { Actor } from './types/Actor';
import { Cell } from './types/Cell';
import { WorldContainer } from './types/WorldContainer';

import { flatten } from './utils/flatten';
import { getDistance } from './utils/getDistance';
import { isEqualPoint } from './utils/isEqualPoint';
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

const isAutoMovement = true;
let worldLevel = 1;

function spawnEnemies(count: number): Actor[] {
  state.world.enemies = Array(count).fill(null).map(() => {
    const selectedTilePoint = getRandomFreeTilePoint();
    const selectedTile = state.world.board[selectedTilePoint.x][selectedTilePoint.y];

    selectedTile.hasActor = true;

    return spawnActor(
      creaturePresets[CreatureType.Skeleton],
      state.world,
      textureSkeleton,
      selectedTile.position,
    );
  });

  return updateEntitiesVisibility(state.world.enemies) as Actor[];
}

function resetWorld(): void {
  // World setup
  state.world.destroy();
  state.world = new PIXI.Container() as WorldContainer;
  state.camera.addChild(state.world);
}

async function startCombat(currentCombat: PIXI.Point): Promise<CombatResult> {
  const combatResult = await combatCheck(currentCombat);

  if (combatResult === CombatResult.Won) {
    const newItem = rollItem(worldLevel, 1);

    state.inventory.temp.push(newItem);
    updateTempInventory(state.inventory.temp);
  }

  return combatResult;
}

async function moveEnemyToCell(enemy: Actor, cell: Cell): Promise<MoveResult.Default | MoveResult.PlayerDeath> {
  // Enemy can't move to the player position
  if (isEqualPoint(cell.position, state.player.position)) {
    const combatResult = await startCombat(cell.position);

    if (combatResult === CombatResult.Lost) {
      return MoveResult.PlayerDeath;
    }
  }
  // Can't move, idling
  if (cell.hasActor) {
    return MoveResult.Default;
  }

  moveActorOnBoard(state.world.board, cell.position, enemy.position, ActorType.Enemy);
  moveEntity(enemy, cell.position);

  return MoveResult.Default;
}

async function movePlayerToCell(cell: Cell): Promise<MoveResult> {
  moveActorOnBoard(state.world.board, cell.position, state.player.position, ActorType.Player);
  moveEntity(state.player, cell.position);

  state.player.lastCells.unshift(cell);
  state.player.lastCells.pop();

  centerCameraOn(state.camera, state.player.sprite, state.app.screen);

  if (cell.entityType === EntityType.Exit) {
    return MoveResult.EnterDungeon;
  }

  return MoveResult.Default;
}

async function enterDungeon(level: number): Promise<void> {
  // Board setup
  let protoBoard = await generateLevel(level + 6, level + 6);

  protoBoard = removeDisconnectedRegions(protoBoard);
  state.world.board = convertToBoard(protoBoard);
  tileBoard(state.world);

  if (!isAutoMovement) {
    for (const tile of flatten(state.world.board)) {
      tile.sprite.on('mousedown', (event) => {
        event.stopPropagation();
        movePlayerToCell(tile);
        state.world.board = updateTilesVisibility(state.player, state.world.board);
        state.world.entities = updateEntitiesVisibility(state.world.entities);
        state.world.enemies = updateEntitiesVisibility(state.world.enemies) as Actor[];
      });
    }
  }

  // Player setup
  const playerSpawnTilePoint = getRandomFreeTilePoint();
  const playerSpawnTile = state.world.board[playerSpawnTilePoint.x][playerSpawnTilePoint.y];

  playerSpawnTile.hasActor = true;
  playerSpawnTile.actorType = ActorType.Player;

  state.player = spawnActor(
    state.player,
    state.world,
    texturePlayer,
    playerSpawnTile.position,
  );
  // TODO: Remove, debug prop
  state.player.movements = [movements.exit, movements.exploring, movements.random];
  state.player.sprite.visible = true;
  centerCameraOn(state.camera, state.player.sprite, state.app.screen);

  state.world.board = updateTilesVisibility(state.player, state.world.board);
  state.world.enemies = spawnEnemies(level * 2 + 4);
  state.world.entities = spawnEntities(state.world);
  state.world.entities = updateEntitiesVisibility(state.world.entities);

  let moveResult = MoveResult.Default;

  while (isAutoMovement) {
    /* eslint-disable no-await-in-loop */
    await timeout(5000 / state.player.speed);

    const selectedPlayerPosition = selectNextMove(state.player, state.world.board);

    moveResult = await movePlayerToCell(selectedPlayerPosition);

    if (selectedPlayerPosition.hasActor) {
      const combatRes = await startCombat(selectedPlayerPosition.position);

      if (combatRes === CombatResult.Lost) {
        moveResult = MoveResult.PlayerDeath;
      }
    }
    // Exit from dungeon cycle
    if (moveResult !== MoveResult.Default) {
      break;
    }

    state.world.board = updateTilesVisibility(state.player, state.world.board);
    state.world.entities = updateEntitiesVisibility(state.world.entities);
    state.world.enemies = updateEntitiesVisibility(state.world.enemies) as Actor[];

    // Separate player move from enemy move
    await timeout(2000 / state.player.speed);

    // Basic enemies movement
    // With sorting we solve the problem where farther enemies can't
    // Move while the near ones haven't made a move yet
    for (const enemy of state.world.enemies.sort(
      (e) => getDistance(state.player.position, e.position),
    )) {
      // Micro optimization: don't try to find the player if the distance is too great
      if (getDistance(enemy.position, state.player.position) > enemy.sightRange) {
        enemy.movements = [movements.random];
      } else {
        enemy.movements = [movements.player, movements.random];
      }
      const selectedMove = selectNextMove(enemy, state.world.board);
      const enemyMoveResult = await moveEnemyToCell(enemy, selectedMove);

      // Player was killed
      if (enemyMoveResult !== MoveResult.PlayerDeath) {
        break;
      }
    }

    state.world.enemies = updateEntitiesVisibility(state.world.enemies) as Actor[];

    /* eslint-enable no-await-in-loop */
  }

  if (moveResult === MoveResult.EnterDungeon) {
    resetWorld();
    await enterDungeon(worldLevel += 1);
    state.camera.position.x = 0;
    state.camera.position.y = 0;
  }
  if (moveResult === MoveResult.PlayerDeath) {
    worldLevel = 1;
    resetWorld();
    state.inventory.temp.splice(0, state.inventory.temp.length / 2);
    state.player = spawnActor(
      state.player,
      state.world,
      texturePlayer,
      playerSpawnTile.position,
    );
    await enterDungeon(worldLevel += 1);
    state.camera.position.x = 0;
    state.camera.position.y = 0;
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
