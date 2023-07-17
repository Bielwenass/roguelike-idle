import wfc from 'wavefunctioncollapse';

import { get2dArray } from '../../utils/get2dArray';

async function imageUrlToData(path: string) {
  const img = document.createElement('img');

  img.src = path;
  await img.onload;

  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx?.drawImage(img, 0, 0);

      resolve(ctx?.getImageData(0, 0, img.width, img.height));
    };
  });
}

export async function generateLevel(width: number, height: number = width): Promise<number[][]> {
  const imgData = await imageUrlToData('../../images/generation/rooms2.png') as ImageData;

  const model = new wfc.OverlappingModel(
    imgData.data, // Sample data
    imgData.width, // Sample width
    imgData.height, // Sample height
    3, // Patterns NxN
    width, // Output width
    height, // Output height
    true, // Sample edges wrap
    false, // Output edges wrap
    8, // Symmetries
    0, // Ground pattern (not applicable to top-down view)
  );

  const success = model.generate(Math.random, 0);

  // Should never happen
  if (!success) {
    console.error('Generation failed');

    return get2dArray(width, height, 0);
  }

  const wfcOutput = model.graphics();
  const resultBoard = get2dArray(width, height, 0);

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      resultBoard[x][y] = Number(wfcOutput[((y * width) + x) * 4] === 255);
    }
  }

  return resultBoard;
}

export function removeDisconnectedRegions(board: number[][]): number[][] {
  const width = board.length;
  const height = board[0].length;

  const tileRegion = get2dArray(width, height, 0);
  const areaByRegion = new Map() as Map<number, number>;

  // Check if the cell is in bounds and can be counted towards area size
  function isValidCell(x: number, y: number): boolean {
    const cellExists = board[x] && board[x][y] !== undefined;

    if (!cellExists) {
      return false;
    }

    const isGround = board[x][y] !== 0;
    const notCounted = tileRegion[x][y] === 0;

    return isGround && notCounted;
  }

  // Count the cell and check adjacent ones
  function count(x: number, y: number, regionId: number): void {
    tileRegion[x][y] = regionId;
    areaByRegion.set(regionId, (areaByRegion.get(regionId) || 0) + 1);

    // Left
    if (isValidCell(x - 1, y)) {
      count(x - 1, y, regionId);
    }

    // Top
    if (isValidCell(x, y - 1)) {
      count(x, y - 1, regionId);
    }

    // Right
    if (isValidCell(x + 1, y)) {
      count(x + 1, y, regionId);
    }

    // Bottom
    if (isValidCell(x, y + 1)) {
      count(x, y + 1, regionId);
    }
  }

  let currentRegionId = 1;

  // "Fill in" the separate areas recursively with count()
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      if (isValidCell(x, y)) {
        count(x, y, currentRegionId);
        currentRegionId += 1;
      }
    }
  }

  // Find largest region
  let maxArea = 0;
  let largestRegionId = 0;

  for (const [regionId, area] of areaByRegion) {
    if (area > maxArea) {
      largestRegionId = regionId;
      maxArea = area;
    }
  }

  // Leave largest region tiles intact, set others to be walls
  return board.map((xArr, x) => xArr.map((cellValue, y) => (tileRegion[x][y] === largestRegionId ? cellValue : 0)));
}
