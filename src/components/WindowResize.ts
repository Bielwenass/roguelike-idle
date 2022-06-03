import { AbstractRenderer } from 'pixi.js';

export function enableResize(renderer: AbstractRenderer) {
  renderer.resize(window.innerWidth, window.innerHeight);

  window.addEventListener('resize', () => {
    renderer.resize(window.innerWidth, window.innerHeight);
  });
}
