import { Graphics } from '@pixi/graphics';

interface HpBar extends Graphics {
  set: (percent: number) => void,
}
