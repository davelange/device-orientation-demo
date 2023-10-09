export const DEBOUNCE_INTERVAL = 10;
export const LIMIT = {
  gamma: {
    low: -40,
    high: 40,
  },
};

export const transformsFromOrientation = (value: number) => ({
  bgTranslate: value / 8,
  bgRotate: (value / 5) * -1,
  fgTranslate: value / 2,
  fgRotate: (value / 3) * -1,
});
