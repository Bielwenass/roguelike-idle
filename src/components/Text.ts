import { Point } from '@pixi/math';
import { Text, TextStyle } from '@pixi/text';

const menuTextStyle = {
  fontFamily: 'monospace',
  fontSize: 24,
  fill: 0xcccccc,
  align: 'center',
} as TextStyle;

export function menuText(label: string, position = new Point(0, 0)): Text {
  const text = new Text(label, menuTextStyle);

  text.x = position.x;
  text.y = position.y;
  text.eventMode = 'static';

  text.on('mouseover', () => {
    text.style.fill = 0xcccc00;
  });

  text.on('mouseout', () => {
    text.style.fill = 0xcccccc;
  });

  return text;
}
