import { Container, Point } from 'pixi.js';

import { getScreenCenterX, getScreenCenterY } from './Camera';
import { moveEntity } from './Entities';
import { state } from './State';
import { TILE_SIZE } from '../constants';
import { combatActionEffects } from '../data/combatActionEffects';
import { ActorType } from '../data/enums/ActorType';
import { CombatResult } from '../data/enums/CombatResult';

import { Actor } from '../types/Actor';
import { CombatContainer } from '../types/CombatContainer';

import { timeout } from '../utils/timeout';

function makeMove(self: Actor, opponent: Actor): { self: Actor, opponent: Actor } {
  const chosenAction = self.strategy(self, opponent);

  return combatActionEffects[chosenAction](self, opponent);
}

function updateHpBars(actors: Actor[]) {
  for (const actor of actors) {
    actor.hpBar.set(actor.currentHealth / actor.maxHealth);
  }
}

async function combatLoop(self: Actor, opponent: Actor, delay: number): Promise<Actor> {
  return new Promise<Actor>((resolve) => {
    setTimeout(() => {
      if (self.currentHealth <= 0) {
        return resolve(opponent);
      }
      if (opponent.currentHealth <= 0) {
        return resolve(self);
      }

      const moveOutcome = makeMove(self, opponent);

      moveOutcome.self.lastActionTime = Date.now();
      updateHpBars([moveOutcome.self, moveOutcome.opponent]);

      const attackDelaySelf = moveOutcome.self.lastActionTime + moveOutcome.self.attackDelay - Date.now();
      const attackDelayOpponent = moveOutcome.opponent.lastActionTime + moveOutcome.opponent.attackDelay - Date.now();

      if (attackDelaySelf < attackDelayOpponent) {
        return resolve(combatLoop(moveOutcome.self, moveOutcome.opponent, attackDelaySelf));
      }

      return resolve(combatLoop(moveOutcome.opponent, moveOutcome.self, attackDelayOpponent));
    }, delay);
  });
}

async function combatProcess(player: Actor, enemy: Actor): Promise<Actor> {
  if (player.attackDelay <= enemy.attackDelay) {
    return combatLoop(player, enemy, player.attackDelay);
  }

  return combatLoop(enemy, player, enemy.attackDelay);
}

export async function enterCombat(enemy: Actor): Promise<boolean> {
  state.world.visible = false;

  const playerWorldPosition = state.player.position.clone();
  const combat = new Container() as CombatContainer;

  combat.zIndex = 0;
  combat.enemy = enemy;

  // Show hp bars
  state.player.hpBar.visible = true;
  enemy.hpBar.visible = true;

  // TODO: Move sprite logic elsewhere
  // Move actors to their combat positions
  combat.addChild(state.player.sprite);
  combat.addChild(enemy.sprite);
  state.player.sprite.position.x = getScreenCenterX() - TILE_SIZE * 2.5;
  state.player.sprite.position.y = getScreenCenterY();
  enemy.sprite.position.x = getScreenCenterX() + TILE_SIZE * 2.5;
  enemy.sprite.position.y = getScreenCenterY();
  enemy.sprite.scale.x *= -1;

  state.combat = combat;
  state.root.addChildAt(state.combat, 0);

  const winner = await combatProcess(state.player, state.combat.enemy);

  // 300ms delay on combat exit
  await timeout(300);

  // Hide hp bars
  state.player.hpBar.visible = false;
  enemy.hpBar.visible = false;

  state.combat.destroy();
  state.world.visible = true;

  const isWin = winner.type === ActorType.Player;

  if (isWin) {
    state.world.addChild(state.player.sprite);
    state.player = winner;
    moveEntity(state.player, playerWorldPosition);
  }

  return isWin;
}

// Start combat at the defined position
export async function combatCheck(combatPosition: Point): Promise<CombatResult> {
  let result = CombatResult.DidNotFight;
  const enemyIdx = state.world.enemies.findIndex((e) => e.position === combatPosition);

  if (enemyIdx !== -1) {
    result = await enterCombat(state.world.enemies[enemyIdx]) ? CombatResult.Won : CombatResult.Lost;

    // TODO: Move elsewhere
    if (result === CombatResult.Won) {
      state.world.enemies.splice(enemyIdx, 1);
    }
  }

  return result;
}
