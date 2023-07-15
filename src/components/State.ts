import { Container } from '@pixi/display';
import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';
import { Application } from 'pixi.js';

import { createHpBar } from './Graphics';
import { creaturePresets } from '../data/creaturePresets';
import { CreatureType } from '../data/enums/CreatureType';
import { movements } from '../data/movements';
import { strategies } from '../data/strategies';

import { Actor } from '../types/Actor';
import { CombatContainer } from '../types/CombatContainer';
import { EquippedItems } from '../types/EquippedItems';
import { Item } from '../types/Item';
import { WorldContainer } from '../types/WorldContainer';

export interface State {
  app: Application<HTMLCanvasElement>,
  root: Container,
  camera: Container,
  world: WorldContainer,
  combat: CombatContainer,
  player: Actor,
  inventory: {
    vault: Item[],
    temp: Item[],
    equipped: EquippedItems,
  },
  meta: {
    lastItemId: number,
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
    lastCells: new Array(5), // array size defines how many last movements to keep
  },
  inventory: {
    vault: [],
    temp: [],
    equipped: {} as EquippedItems,
  },
  meta: {
    lastItemId: 1,
  },
};
