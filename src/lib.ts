const GAMMA_LIMIT = 40;

export const isOffLimit = (value: number) =>
  value < -GAMMA_LIMIT || value > GAMMA_LIMIT;

const getDampingFactor = (value: number) => {
  const absValue = Math.abs(value);

  if (absValue < 10) return 5;
  if (absValue < 20) return 7;
  return 10;
};

export const transformsFromOrientation = (value: number) => ({
  translateX: value / getDampingFactor(value),
  rotateY: (value / 5) * -1,
});

export function throttle(fn: (params?: any) => void, interval: number) {
  let enabled = true;

  function startInterval(interval: number) {
    enabled = false;

    setTimeout(() => {
      enabled = true;
    }, interval);
  }

  return (params?: any) => {
    if (!enabled) {
      return;
    }

    startInterval(interval);

    fn(params);
  };
}
