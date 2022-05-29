import { Container } from '@pixi/display';
import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';

import { creaturePresets } from '../data/creaturePresets';
import { CreatureType } from '../data/enums/CreatureType';
import { strategies } from '../data/strategies';
import { createHpBar } from './Graphics';

import { Actor } from '../types/Actor';
import { CombatContainer } from '../types/CombatContainer';
import { WorldContainer } from '../types/WorldContainer';

export interface State {
  root: Container,
  camera: Container,
  world: WorldContainer,
  combat: CombatContainer,
  player: Actor,
}

// Initial state
export const state: State = {
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
    lastActionTime: -1,
  },
};
