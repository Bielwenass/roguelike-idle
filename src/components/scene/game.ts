import { Container } from '@pixi/display';

export abstract class GameScene extends Container {
  // eslint-disable-next-line class-methods-use-this
  public onSceneEnter(): Promise<void> {
    console.debug(`${this.constructor.name}::GameScene::onSceneEnter`);

    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  public onSceneLeave(): Promise<void> {
    console.debug(`${this.constructor.name}::GameScene::onSceneLeave`);

    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  public onSceneTick(): Promise<void> {
    console.debug(`${this.constructor.name}::GameScene::onSceneTick`);

    return Promise.resolve();
  }
}
