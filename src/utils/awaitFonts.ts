import FontFaceObserver from 'fontfaceobserver';

const bitgothic = new FontFaceObserver('Bitgothic');
const timetwist = new FontFaceObserver('Timetwist');

export async function loadFonts(): Promise<unknown> {
  return Promise.all([bitgothic.load(), timetwist.load()]);
}
