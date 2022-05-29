import { Container, Point } from 'pixi.js';

import { combatActionEffects } from '../data/combatActionEffects';
import { moveEntity } from './Entities';
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
  const playerWorldPosition = state.player.position.clone();

  const combat = new Container() as CombatContainer;

  combat.enemy = enemy;

  // Show hp bars
  state.player.hpBar.visible = true;
  enemy.hpBar.visible = true;

  // Move actors to their combat positions
  combat.addChild(state.player.sprite);
  combat.addChild(enemy.sprite);
  moveEntity(state.player, new Point(3, 3));
  moveEntity(enemy, new Point(8, 3));

  state.combat = combat;
  state.root.addChild(state.combat);

  const combatResult = await combatProcess();

  // Hide hp bars
  state.player.hpBar.visible = false;
  enemy.hpBar.visible = false;

  if (combatResult.isWin) {
    state.combat.destroy();

    state.world.visible = true;

    state.world.addChild(state.player.sprite);
    moveEntity(state.player, playerWorldPosition);
  }

  return combatResult;
}
