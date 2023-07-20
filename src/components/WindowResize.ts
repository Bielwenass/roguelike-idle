import type { Application } from '@pixi/app';

export function enableResize(renderer: Application['renderer']) {
  renderer.resize(window.innerWidth, window.innerHeight);

  window.addEventListener('resize', () => {
    renderer.resize(window.innerWidth, window.innerHeight);
  });
}
