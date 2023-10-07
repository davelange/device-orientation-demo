export const DEBOUNCE_INTERVAL = 10;
export const LIMIT = {
  gamma: {
    low: -40,
    high: 40,
  },
};

export const transformsFromOrientation = (value: number) => ({
  bgTranslate: value / 20,
  bgRotate: (value / 6) * -1,
  fgTranslate: value / 10,
  fgRotate: (value / 3) * -1,
});
