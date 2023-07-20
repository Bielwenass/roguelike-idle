import { Container } from '@pixi/display';

import { TILE_SIZE } from '../../constants';
import { combatActionEffects } from '../../data/combatActionEffects';
import { getScreenCenterX, getScreenCenterY } from '../Camera';
import { state } from '../State';

import type { Actor } from '../../types/Actor';
import type { CombatContainer } from '../../types/CombatContainer';

import { timeout } from '../../utils/timeout';

function makeMove(self: Actor, opponent: Actor): { self: Actor, opponent: Actor } {
  const chosenAction = self.strategy(self, opponent);

  return combatActionEffects[chosenAction](self, opponent);
}

function updateHpBars(actors: Actor[]) {
  for (const actor of actors) {
    actor.hpBar.set(actor.currentHealth / actor.maxHealth);
  }
}

// Perform combat and return the winning actor
async function combatLoop(self: Actor, opponent: Actor, delay: number): Promise<Actor> {
  return new Promise<Actor>((resolve) => {
    setTimeout(() => {
      const moveOutcome = makeMove(self, opponent);

      updateHpBars([moveOutcome.self, moveOutcome.opponent]);

      // Battle end condition
      if (moveOutcome.self.currentHealth <= 0) {
        return resolve(opponent);
      }
      if (moveOutcome.opponent.currentHealth <= 0) {
        return resolve(self);
      }

      moveOutcome.self.lastActionTime = Date.now();

      const attackDelaySelf = moveOutcome.self.lastActionTime + moveOutcome.self.attackDelay - Date.now();
      const attackDelayOpponent = moveOutcome.opponent.lastActionTime + moveOutcome.opponent.attackDelay - Date.now();

      if (attackDelaySelf < attackDelayOpponent) {
        return resolve(combatLoop(moveOutcome.self, moveOutcome.opponent, attackDelaySelf));
      }

      return resolve(combatLoop(moveOutcome.opponent, moveOutcome.self, attackDelayOpponent));
    }, delay);
  });
}

async function combatProcess(attacker: Actor, defender: Actor): Promise<Actor> {
  // Normalize last action time for proper delay calculation
  attacker.lastActionTime = Date.now();
  defender.lastActionTime = Date.now();

  if (attacker.attackDelay <= defender.attackDelay) {
    return combatLoop(attacker, defender, attacker.attackDelay);
  }

  return combatLoop(defender, attacker, defender.attackDelay);
}

export async function enterCombat(attacker: Actor, defender: Actor): Promise<Actor> {
  state.world.visible = false;

  const combat = new Container() as CombatContainer;

  combat.zIndex = 0;
  combat.attacker = attacker;
  combat.defender = defender;

  // Show hp bars
  attacker.hpBar.visible = true;
  defender.hpBar.visible = true;

  // TODO: Move sprite logic elsewhere
  // Move actors to their combat positions
  combat.addChild(attacker.sprite);
  combat.addChild(defender.sprite);
  attacker.sprite.position.x = getScreenCenterX() - TILE_SIZE * 2.5;
  attacker.sprite.position.y = getScreenCenterY();
  defender.sprite.position.x = getScreenCenterX() + TILE_SIZE * 2.5;
  defender.sprite.position.y = getScreenCenterY();
  defender.sprite.scale.x *= -1;

  state.combat = combat;
  state.root.addChildAt(state.combat, 0);

  const winner = await combatProcess(attacker, defender);

  // 300ms delay on combat exit
  await timeout(300);

  // Hide hp bars
  attacker.hpBar.visible = false;
  defender.hpBar.visible = false;

  state.combat.destroy();
  state.world.visible = true;

  const winnerSprite = state.world.addChild(winner.sprite);

  winnerSprite.scale.x = Math.abs(winnerSprite.scale.x);

  return {
    ...winner,
    sprite: winnerSprite,
  };
}
