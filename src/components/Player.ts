import { creaturePresets } from '../data/creaturePresets';
import { CreatureType } from '../data/enums/CreatureType';

import { Actor } from '../types/Actor';
import { EquippedItems } from '../types/EquippedItems';

export function calculateStats(player: Actor, equipment: EquippedItems): Actor {
  const playerBase = creaturePresets[CreatureType.Player];

  player.attack = playerBase.attack;
  player.attackDelay = playerBase.attackDelay;
  player.defense = playerBase.defense;
  player.speed = playerBase.speed;

  for (const item of Object.values(equipment)) {
    if (item?.attack) {
      player.attack += item.attack;
    }
    if (item?.attackDelay) {
      player.attackDelay = item.attackDelay;
    }
    if (item?.defense) {
      player.defense += item.defense;
    }
    if (item?.speed) {
      player.speed += item.speed;
    }
  }

  return player;
}
