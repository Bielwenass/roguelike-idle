import { ActorType } from './enums/ActorType';
import { CreatureType } from './enums/CreatureType';

import { ActorBase } from '../types/Actor';

export const creaturePresets: Record<CreatureType, ActorBase> = {
  [CreatureType.Player]: {
    name: 'Player',
    type: ActorType.Player,
    maxHealth: 50,
    attack: 2,
    attackDelay: 1000,
    defense: 2,
    speed: 10,
    sightRange: 10,
  },
  [CreatureType.Skeleton]: {
    name: 'Skeleton',
    type: ActorType.Enemy,
    maxHealth: 5,
    attack: 3,
    attackDelay: 800,
    defense: 1,
    speed: 2,
    sightRange: 3,
  },
};
