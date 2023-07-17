import * as PIXI from 'pixi.js';
import { BaseTexture, Container } from 'pixi.js';

import { ItemType } from '../../data/enums/ItemType';

import { HpBar } from '../../types/HpBar';

// TODO: Look into TextureCache

// Enable zIndex
Container.defaultSortableChildren = true;
// Enable sharp pixel scaling
BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;

const texturePlayer = PIXI.Texture.from('images/player.png');
const textureSkeleton = PIXI.Texture.from('images/skeleton.png');
const textureTile = PIXI.Texture.from('images/tile_dungeon.png');
const textureWall = PIXI.Texture.from('images/bricks.png');
const textureExit = PIXI.Texture.from('images/hatch.png');
const textureChest = PIXI.Texture.from('images/chest.png');
const textureUiInventoryBorder = PIXI.Texture.from('images/ui/icon_border.png');
const textureUiInventoryBg = PIXI.Texture.from('images/ui/inventory_backdrop.png');
const textureUiInventoryEquip = PIXI.Texture.from('images/ui/equipment_backdrop.png');
const textureUiVaultBg = PIXI.Texture.from('images/ui/vault_backdrop.png');
const textureIconDagger = PIXI.Texture.from('images/ui/icon_dagger.png');
const textureIconSword = PIXI.Texture.from('images/ui/icon_sword.png');
const textureIconGreatsword = PIXI.Texture.from('images/ui/icon_greatsword.png');
const textureIconHelmet = PIXI.Texture.from('images/ui/icon_helmet.png');
const textureIconChestplate = PIXI.Texture.from('images/ui/icon_chestplate.png');
const textureIconGloves = PIXI.Texture.from('images/ui/icon_gloves.png');
const textureIconBoots = PIXI.Texture.from('images/ui/icon_boots.png');

export {
  texturePlayer,
  textureSkeleton,
  textureTile,
  textureWall,
  textureExit,
  textureChest,
  textureUiInventoryBorder,
  textureUiInventoryBg,
  textureUiInventoryEquip,
  textureUiVaultBg,
  textureIconDagger,
  textureIconSword,
  textureIconGreatsword,
  textureIconHelmet,
  textureIconChestplate,
  textureIconGloves,
  textureIconBoots,
};

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

export function getItemIcon(type: ItemType): PIXI.Texture {
  const iconByType = {
    [ItemType.Dagger]: textureIconDagger,
    [ItemType.Sword]: textureIconSword,
    [ItemType.Greatsword]: textureIconGreatsword,
    [ItemType.Helmet]: textureIconHelmet,
    [ItemType.Chestplate]: textureIconChestplate,
    [ItemType.Gloves]: textureIconGloves,
    [ItemType.Boots]: textureIconBoots,
  };

  return iconByType[type];
}
