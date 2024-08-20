import { ItemType } from '@data/enums/ItemType';
import {
  Assets,
  Graphics,
  TextureSource,
} from 'pixi.js';

import type { HpBar } from '@type/HpBar';
import type { Texture } from 'pixi.js';

// Enable sharp pixel scaling
TextureSource.defaultOptions.scaleMode = 'nearest';

// TODO: Look into TextureCache
// TODO: Refactor this shit
const texturePlayer = await Assets.load('images/player.png');
const textureSkeleton = await Assets.load('images/skeleton.png');
const textureTile = await Assets.load('images/tile_dungeon.png');
const textureWall = await Assets.load('images/bricks.png');
const textureExit = await Assets.load('images/hatch.png');
const textureChest = await Assets.load('images/chest.png');
const textureUiInventoryBorder = await Assets.load('images/ui/icon_border.png');
const textureUiInventoryBg = await Assets.load('images/ui/inventory_backdrop.png');
const textureUiInventoryEquip = await Assets.load('images/ui/equipment_backdrop.png');
const textureUiVaultBg = await Assets.load('images/ui/vault_backdrop.png');
const textureIconDagger = await Assets.load('images/ui/icon_dagger.png');
const textureIconSword = await Assets.load('images/ui/icon_sword.png');
const textureIconGreatsword = await Assets.load('images/ui/icon_greatsword.png');
const textureIconHelmet = await Assets.load('images/ui/icon_helmet.png');
const textureIconChestplate = await Assets.load('images/ui/icon_chestplate.png');
const textureIconGloves = await Assets.load('images/ui/icon_gloves.png');
const textureIconBoots = await Assets.load('images/ui/icon_boots.png');

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

  // TODO: Fix bar not being displayed
  hpBar.rect(0, -6, 16, 1.5);
  hpBar.setStrokeStyle({
    width: 1,
    color: 0x333333,
    alignment: 1,
  });
  hpBar.fill(0x555555);

  const fillRect = hpBarFill.rect(0, -6, 16, 1.5);

  hpBarFill.fill(0xaa0000);

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
