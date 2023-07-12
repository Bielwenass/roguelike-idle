import { ActorType } from './enums/ActorType';
import { CreatureType } from './enums/CreatureType';

import { ActorBase } from '../types/Actor';

export const creaturePresets = {
  [CreatureType.Player]: {
    name: 'Player',
    type: ActorType.Player,
    maxHealth: 100,
    attack: 3,
    attackDelay: 1000,
    speed: 20,
    sightRange: 10,
  },
  [CreatureType.Skeleton]: {
    name: 'Skeleton',
    type: ActorType.Enemy,
    maxHealth: 5,
    attack: 1,
    attackDelay: 800,
    speed: 2,
    sightRange: 3,
  },
} as Record<CreatureType, ActorBase>;
