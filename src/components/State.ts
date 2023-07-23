import { creaturePresets } from '@data/creaturePresets';
import { CreatureType } from '@data/enums/CreatureType';
import { movements } from '@data/movements';
import { strategies } from '@data/strategies';
import { Application } from '@pixi/app';
import { Point } from '@pixi/core';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';

import { createHpBar } from './graphics/Graphics';
import { loadState } from './SaveManagement';

import type { Actor } from '@type/Actor';
import type { CombatContainer } from '@type/CombatContainer';
import type { Item } from '@type/Item';
import type { WorldContainer } from '@type/WorldContainer';

type Inventory = {
  vault: Item[],
  backpack: Item[],
  equipped: (Item | null)[],
  gold: number,
};

type MetaInfo = {
  lastItemId: number,
  worldLevel: number,
};

export interface State {
  app: Application<HTMLCanvasElement>,
  root: Container,
  camera: Container,
  world: WorldContainer,
  combat: CombatContainer,
  player: Actor,
  inventory: Inventory,
  meta: MetaInfo
}

export const initialState: State = {
  app: new Application(),
  root: new Container(),
  camera: new Container(),
  world: new Container() as WorldContainer,
  combat: new Container() as CombatContainer,
  player: {
    ...creaturePresets[CreatureType.Player],
    currentHealth: creaturePresets[CreatureType.Player].maxHealth,
    sprite: new Sprite(),
    hpBar: createHpBar(),
    position: new Point(0, 0),
    strategy: strategies.dummy,
    movements: [movements.random],
    lastActionTime: -1,
    lastCells: new Array(5), // Array size defines movement history length
  },
  inventory: {
    vault: [],
    backpack: [],
    equipped: [],
    gold: 0,
  },
  meta: {
    lastItemId: 0,
    worldLevel: 1,
  },
};

export const state = loadState(initialState);
