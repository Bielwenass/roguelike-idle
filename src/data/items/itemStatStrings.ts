export const itemStatStrings = {
  type: {
    label: 'Type',
    getValue: (raw: string) => raw,
  },
  rarity: {
    label: 'Rarity',
    getValue: (raw: string) => raw,
  },
  level: {
    label: 'Item Level',
    getValue: (raw: number) => String(raw),
  },
  attack: {
    label: 'Attack',
    getValue: (raw: number) => `+${raw}`,
  },
  attackDelay: {
    label: 'Attack Speed',
    getValue: (raw: number) => `${1000 / raw}/s`,
  },
  defense: {
    label: 'Defense',
    getValue: (raw: number) => `+${raw}`,
  },
  speed: {
    label: 'Speed',
    getValue: (raw: number) => `+${raw}`,
  },
  goldValue: {
    label: 'Gold Value',
    getValue: (raw: number) => String(raw),
  },
};
