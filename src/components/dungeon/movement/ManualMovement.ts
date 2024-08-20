import { Point } from 'pixi.js';

export class ManualMovement {
  private static instance: ManualMovement;

  private static resolver: (value: Point) => void;

  private constructor() {
    ManualMovement.resolver = () => {};
    ManualMovement.initListeners();
  }

  private static initListeners(): void {
    document.body.addEventListener('keydown', ((event: KeyboardEvent) => {
      if (event.key === 'w') {
        this.resolver(new Point(0, -1));
      } else if (event.key === 'a') {
        this.resolver(new Point(-1, 0));
      } else if (event.key === 's') {
        this.resolver(new Point(0, 1));
      } else if (event.key === 'd') {
        this.resolver(new Point(1, 0));
      }
    }));
  }

  public static async waitForKeypress(): Promise<Point> {
    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  public static getInstance() {
    if (!ManualMovement.instance) {
      ManualMovement.instance = new ManualMovement();
    }

    return ManualMovement.instance;
  }
}
