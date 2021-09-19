import * as PIXI from 'pixi.js';

export function initGraphics() {
  // TODO Look into later
  // const TextureCache = PIXI.utils.TextureCache

  // Enable zIndex
  PIXI.settings.SORTABLE_CHILDREN = true;

  const texturePlayer = PIXI.Texture.from('images/player1.png');
  const textureSkeleton = PIXI.Texture.from('images/skeleton.png');
  const textureTile = PIXI.Texture.from('images/tile_dungeon.png');
  const textureWall = PIXI.Texture.from('images/bricks.png');

  texturePlayer.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  textureSkeleton.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  textureTile.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  textureWall.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

  return {
    texturePlayer,
    textureSkeleton,
    textureTile,
    textureWall,
  };
}

export default initGraphics;
