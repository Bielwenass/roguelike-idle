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

// TODO: Consider better ways to load assets
const assetToUrl = {
  player: 'images/player.png',
  skeleton: 'images/skeleton.png',
  tile: 'images/tile_dungeon.png',
  wall: 'images/bricks.png',
  exit: 'images/hatch.png',
  chest: 'images/chest.png',
  uiInventoryBorder: 'images/ui/icon_border.png',
  uiInventoryBg: 'images/ui/inventory_backdrop.png',
  uiInventoryEquip: 'images/ui/equipment_backdrop.png',
  uiVaultBg: 'images/ui/vault_backdrop.png',
  iconDagger: 'images/ui/icon_dagger.png',
  iconSword: 'images/ui/icon_sword.png',
  iconGreatsword: 'images/ui/icon_greatsword.png',
  iconHelmet: 'images/ui/icon_helmet.png',
  iconChestplate: 'images/ui/icon_chestplate.png',
  iconGloves: 'images/ui/icon_gloves.png',
  iconBoots: 'images/ui/icon_boots.png',
};

const assets = await Assets.load(Object.values(assetToUrl));

export const textures = Object.fromEntries(
  Object.entries(assetToUrl).map(([key, value]) => [key, assets[value]]),
) as Record<keyof typeof assetToUrl, Texture>;

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
    [ItemType.Dagger]: textures.iconDagger,
    [ItemType.Sword]: textures.iconSword,
    [ItemType.Greatsword]: textures.iconGreatsword,
    [ItemType.Helmet]: textures.iconHelmet,
    [ItemType.Chestplate]: textures.iconChestplate,
    [ItemType.Gloves]: textures.iconGloves,
    [ItemType.Boots]: textures.iconBoots,
  };

  return iconByType[type];
}
