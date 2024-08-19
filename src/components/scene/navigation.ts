import { Container } from '@pixi/display';

import { SceneManager } from './manager';
import { saveState } from '../SaveManagement';
import { EmptyScene } from '../scenes/empty';
import { TownScene } from '../scenes/town';
import { type State } from '../State';

/**
 * @classdesc This class provides a list of available scenes for easier navigation
 */
export class SceneNavigator extends Container {
  public constructor(private readonly state: State, public readonly manager = new SceneManager()) {
    super();
  }

  public gotoEmpty() {
    return this.manager.switchScene(new EmptyScene());
  }

  public gotoTown() {
    return this.manager.switchScene(new TownScene(() => saveState(this.state), this.state.meta));
  }
}
