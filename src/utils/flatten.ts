type NestedArray<T> = Array<NestedArray<T> | T>;

export function flatten<T>(input: NestedArray<T>, acc: T[] = []): T[] {
  return input.reduce((_: T[], current) => {
    if (Array.isArray(current)) return flatten(current, acc);
    acc.push(current);

    return acc;
  }, []);
}
