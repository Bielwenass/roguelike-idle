import { Container } from '@pixi/display';

import { EmptyScene } from '../scenes/empty';

import type { GameScene } from './game';

/**
 * @classdesc This class allows you to switch between scenes. The previous scene will be automatically destroyed
 */
export class SceneManager extends Container {
  public constructor(public active: GameScene = new EmptyScene()) {
    super();
  }

  public async switchScene(scene: GameScene) {
    await this.active.onSceneLeave();

    console.debug(`SceneManager::onSceneLeave [ ${this.active.constructor.name} ]`);

    this.active.destroy();
    this.active = scene;

    this.addChild(this.active);
    await this.active.onSceneEnter();

    console.debug(`SceneManager::onSceneEnter [ ${this.active.constructor.name} ]`);
  }

  public async tick() {
    return this.active.onSceneTick();
  }
}
