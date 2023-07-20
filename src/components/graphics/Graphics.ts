import { SCALE_MODES } from '@pixi/constants';
import { BaseTexture, Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { settings } from '@pixi/settings';

import { ItemType } from '../../data/enums/ItemType';

import type { HpBar } from '../../types/HpBar';

// TODO: Look into TextureCache

// Enable zIndex
Container.defaultSortableChildren = true;
// Enable sharp pixel scaling
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
settings.ROUND_PIXELS = true;

const texturePlayer = Texture.from('images/player.png');
const textureSkeleton = Texture.from('images/skeleton.png');
const textureTile = Texture.from('images/tile_dungeon.png');
const textureWall = Texture.from('images/bricks.png');
const textureExit = Texture.from('images/hatch.png');
const textureChest = Texture.from('images/chest.png');
const textureUiInventoryBorder = Texture.from('images/ui/icon_border.png');
const textureUiInventoryBg = Texture.from('images/ui/inventory_backdrop.png');
const textureUiInventoryEquip = Texture.from('images/ui/equipment_backdrop.png');
const textureUiVaultBg = Texture.from('images/ui/vault_backdrop.png');
const textureIconDagger = Texture.from('images/ui/icon_dagger.png');
const textureIconSword = Texture.from('images/ui/icon_sword.png');
const textureIconGreatsword = Texture.from('images/ui/icon_greatsword.png');
const textureIconHelmet = Texture.from('images/ui/icon_helmet.png');
const textureIconChestplate = Texture.from('images/ui/icon_chestplate.png');
const textureIconGloves = Texture.from('images/ui/icon_gloves.png');
const textureIconBoots = Texture.from('images/ui/icon_boots.png');

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
  const hpBar = new Graphics() as HpBar;
  const hpBarFill = new Graphics();

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

export function getItemIcon(type: ItemType): Texture {
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
