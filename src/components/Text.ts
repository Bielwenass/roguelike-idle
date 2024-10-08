import { Point, Text } from 'pixi.js';

import type { TextStyle } from 'pixi.js';

const textStyles: Record<string, TextStyle> = {
  menu: {
    fontFamily: 'Bitgothic',
    fontSize: 40,
    lineHeight: 40,
    fill: 0xcccccc,
    padding: 10,
    align: 'center',
  } as TextStyle,
  inventory: {
    fontFamily: 'Timetwist',
    padding: 2,
    fontSize: 14,
    fill: 0xcccccc,
    align: 'center',
  } as TextStyle,
  inventoryPale: {
    fontFamily: 'Timetwist',
    padding: 2,
    fontSize: 14,
    fill: 0x555555,
    align: 'center',
  } as TextStyle,
};

export function drawText(
  label: string,
  style: keyof typeof textStyles,
  position = new Point(0, 0),
  isInteractive: boolean = false,
): Text {
  const text = new Text({
    text: label, style: textStyles[style]!,
  });

  text.x = position.x;
  text.y = position.y;

  if (isInteractive) {
    text.eventMode = 'static';

    text.on('mouseover', () => {
      text.style.fill = 0xbb9900;
    });

    text.on('mouseout', () => {
      text.style.fill = 0xcccccc;
    });
  }

  return text;
}
