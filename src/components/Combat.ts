import { Container } from 'pixi.js';

import { TILE_SIZE } from '../constants';
import { combatActionEffects } from '../data/combatActionEffects';
import { state } from './State';

import { Actor } from '../types/Actor';
import { CombatContainer } from '../types/CombatContainer';
import { CombatResult } from '../types/CombatResult';

function makeMove(self: Actor, opponent: Actor): { self: Actor, opponent: Actor } {
  const chosenAction = self.strategy(self, opponent);

  return combatActionEffects[chosenAction](self, opponent);
}

function updateHpBars(actors: Actor[]) {
  actors.forEach((actor) => {
    actor.hpBar.set(actor.currentHealth / actor.maxHealth);
  });
}

async function combatLoop(isPlayer: boolean) {
  const attackDelay = isPlayer ? state.player.attackDelay : state.combat.enemy.attackDelay;

  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      let self = isPlayer ? state.player : state.combat.enemy;
      let opponent = isPlayer ? state.combat.enemy : state.player;

      if (opponent.currentHealth <= 0) {
        resolve(isPlayer);

        return;
      } if (self.currentHealth <= 0) {
        resolve(!isPlayer);

        return;
      }

      ({
        self,
        opponent,
      } = makeMove(self, opponent));

      state.player = isPlayer ? self : opponent;
      state.combat.enemy = isPlayer ? opponent : self;

      updateHpBars([self, opponent]);

      resolve(combatLoop(isPlayer));
    }, attackDelay);
  });
}

async function combatProcess(): Promise<CombatResult> {
  const playerLoop = combatLoop(true);
  const enemyLoop = combatLoop(false);

  return Promise.race([playerLoop, enemyLoop]).then((isWin) => ({
    isWin,
    rewards: [],
  }));
}

export async function enterCombat(enemy: Actor): Promise<CombatResult> {
  state.world.visible = false;

  const playerWorldPosition = state.player.sprite.position.clone();
  const combat = new Container() as CombatContainer;

  combat.enemy = enemy;

  // Show hp bars
  state.player.hpBar.visible = true;
  enemy.hpBar.visible = true;

  combat.addChild(state.player.sprite);
  combat.addChild(enemy.sprite);

  state.combat = combat;
  state.root.addChild(state.combat);

  state.player.sprite.x = 3 * TILE_SIZE;
  state.player.sprite.y = 3 * TILE_SIZE;

  enemy.sprite.x = 8 * TILE_SIZE;
  enemy.sprite.y = 3 * TILE_SIZE;

  const combatResult = await combatProcess();

  state.player.hpBar.visible = false;
  enemy.hpBar.visible = false;

  if (combatResult.isWin) {
    state.combat.destroy();

    state.world.visible = true;

    state.world.addChild(state.player.sprite);
    state.player.sprite.position = playerWorldPosition;
  }

  return combatResult;
}
