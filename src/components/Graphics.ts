import * as PIXI from 'pixi.js';

import { HpBar } from '../types/HpBar';

const textureIconSword = PIXI.Texture.from('images/ui/icon_sword.png');

textureIconSword.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

export function initGraphics() {
  // TODO Look into later
  // const TextureCache = PIXI.utils.TextureCache

  // Enable zIndex
  PIXI.settings.SORTABLE_CHILDREN = true;

  const texturePlayer = PIXI.Texture.from('images/player3.png');
  const textureSkeleton = PIXI.Texture.from('images/skeleton.png');
  const textureTile = PIXI.Texture.from('images/tile_dungeon.png');
  const textureWall = PIXI.Texture.from('images/bricks.png');
  const textureExit = PIXI.Texture.from('images/hatch.png');
  const textureChest = PIXI.Texture.from('images/chest.png');
  const textureUiInventoryBorder = PIXI.Texture.from('images/ui/icon_border.png');
  const textureUiInventoryBg = PIXI.Texture.from('images/ui/inventory_backdrop.png');

  texturePlayer.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  textureSkeleton.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  textureTile.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  textureWall.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  textureExit.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  textureChest.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  textureUiInventoryBorder.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  textureUiInventoryBg.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

  return {
    texturePlayer,
    textureSkeleton,
    textureTile,
    textureWall,
    textureExit,
    textureChest,
    textureUiInventoryBorder,
    textureUiInventoryBg,
  };
}

export function createHpBar() {
  const hpBar = new PIXI.Graphics() as HpBar;
  const hpBarFill = new PIXI.Graphics();

  hpBar.beginFill(0x111111);
  hpBar.lineStyle({
    width: 1,
    color: 0x333333,
    alignment: 1,
  });
  hpBar.drawRect(0, -6, 16, 1);

  hpBarFill.beginFill(0xaa0000);
  const fillRect = hpBarFill.drawRect(0, -6, 16, 1);

  hpBar.addChild(hpBarFill);
  hpBar.set = (percent: number) => {
    fillRect.width = Math.max(percent * 16, 0);
  };

  return hpBar;
}

// TODO: Multiple icons
export function getItemIcon(): PIXI.Texture {
  return textureIconSword;
}
