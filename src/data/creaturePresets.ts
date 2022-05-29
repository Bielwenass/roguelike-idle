import { ActorType } from './enums/ActorType';
import { CreatureType } from './enums/CreatureType';

import { ActorBase } from '../types/Actor';

export const creaturePresets = {
  [CreatureType.Player]: {
    name: 'Player',
    type: ActorType.Player,
    maxHealth: 10,
    attack: 3,
    speed: 2,
    sightRange: 4,
    attackDelay: 1000,
  },
  [CreatureType.Skeleton]: {
    name: 'Skeleton',
    type: ActorType.Enemy,
    maxHealth: 5,
    attack: 1,
    speed: 1,
    sightRange: 3,
    attackDelay: 800,
  },
} as Record<CreatureType, ActorBase>;
