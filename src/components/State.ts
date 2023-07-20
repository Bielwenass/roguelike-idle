import { Application } from '@pixi/app';
import { Container } from '@pixi/display';
import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { createHpBar } from './graphics/Graphics';
import { creaturePresets } from '../data/creaturePresets';
import { CreatureType } from '../data/enums/CreatureType';
import { movements } from '../data/movements';
import { strategies } from '../data/strategies';

import type { Actor } from '../types/Actor';
import type { CombatContainer } from '../types/CombatContainer';
import type { Item } from '../types/Item';
import type { WorldContainer } from '../types/WorldContainer';

export interface State {
  app: Application<HTMLCanvasElement>,
  root: Container,
  camera: Container,
  world: WorldContainer,
  combat: CombatContainer,
  player: Actor,
  inventory: {
    vault: Item[],
    backpack: Item[],
    equipped: (Item | null)[],
    gold: number,
  },
  meta: {
    lastItemId: number,
    worldLevel: number,
  }
}

// Initial state
export const state: State = {
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
