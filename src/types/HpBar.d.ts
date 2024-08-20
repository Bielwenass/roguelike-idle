import type { Graphics } from 'pixi.js';

interface HpBar extends Graphics {
  set: (percent: number) => void,
}
