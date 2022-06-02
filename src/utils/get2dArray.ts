export function get2dArray<T>(width: number, height: number, defaultValue: T): T[][] {
  return Array.from({
    length: width,
  }, () => Array.from({
    length: height,
  }, () => defaultValue));
}
