export const itemStatStrings = {
  type: {
    label: 'Type',
    getValue: (raw: unknown | string) => String(raw),
  },
  rarity: {
    label: 'Rarity',
    getValue: (raw: unknown | string) => String(raw),
  },
  level: {
    label: 'Item Level',
    getValue: (raw: unknown | number) => String(raw),
  },
  attack: {
    label: 'Attack',
    getValue: (raw: unknown | number) => `+${raw}`,
  },
  attackDelay: {
    label: 'Attack Speed',
    getValue: (raw: unknown | number) => `${1000 / Number(raw)}/s`,
  },
  defense: {
    label: 'Defense',
    getValue: (raw: unknown | number) => `+${raw}`,
  },
  speed: {
    label: 'Speed',
    getValue: (raw: unknown | number) => `+${raw}`,
  },
  goldValue: {
    label: 'Gold Value',
    getValue: (raw: unknown | number) => String(raw),
  },
};
