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
