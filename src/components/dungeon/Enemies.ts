import { updateEntitiesVisibility } from './Entities';
import { getRandomFreeTilePoint } from './Tiling';
import { creaturePresets } from '../../data/creaturePresets';
import { CreatureType } from '../../data/enums/CreatureType';
import { spawnActor } from '../Actors';
import { textureSkeleton } from '../graphics/Graphics';

import type { ActorBase, Actor } from '../../types/Actor';
import type { WorldContainer } from '../../types/WorldContainer';

export function scaleEnemy(enemy: ActorBase, level: number): ActorBase {
  return {
    ...enemy,
    maxHealth: enemy.maxHealth * 1.1 ** level,
    attack: enemy.attack * 1.1 ** level,
    defense: enemy.defense * 1.1 ** level,
  };
}

export function spawnEnemies(count: number, level: number, world: WorldContainer): Actor[] {
  const enemies = Array(count).fill(null).map(() => {
    const selectedTilePoint = getRandomFreeTilePoint();
    const selectedTile = world.board[selectedTilePoint.x][selectedTilePoint.y];
    const newEnemy = spawnActor(
      scaleEnemy(creaturePresets[CreatureType.Skeleton], level),
      world,
      textureSkeleton,
      selectedTile.position,
    );

    selectedTile.actor = newEnemy;

    return newEnemy;
  });

  return updateEntitiesVisibility(enemies) as Actor[];
}
