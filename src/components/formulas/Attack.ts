import type { Actor } from '@type/Actor';

export function getDamage(attacker: Actor, defender: Actor): number {
  const rawDamage = attacker.attack * (attacker.attack / (defender.defense + attacker.attack));

  return Math.floor(rawDamage);
}
