const GAMMA_LIMIT = 40;
const MOUSE_POS_LIMIT = 340;
const MOUSE_X_LIMIT = 16;

/* 
About device orientation:

Assuming device flat on a table
gamma: Z axis (left / right)
beta: X axis (front / back)
*/

export const isOffLimit = (value: number) =>
  value < -GAMMA_LIMIT || value > GAMMA_LIMIT;

export function calcMousePosToCenter(window: number, pos: number) {
  const mid = window / 2;
  const diff = mid - pos;
  const dir = Math.sign(diff);
  const absDiff = Math.abs(diff);

  if (absDiff > MOUSE_POS_LIMIT) {
    return null;
  }

  return ((absDiff * 5) / 100) * dir;
}

function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

function getEasedValue({
  maxPosition,
  maxOutput,
  value,
}: {
  maxPosition: number;
  maxOutput: number;
  value: number;
}) {
  let positionProgress = (Math.abs(value) * 100) / maxPosition / 100;
  let eased = easeOutQuint(positionProgress) * maxOutput;

  return eased * Math.sign(value);
}

export const transformsFromOrientation = ({
  gamma,
  mouseX,
}: {
  gamma: number | undefined;
  mouseX: number | undefined;
}) => {
  if (gamma !== undefined) {
    const translateX = getEasedValue({
      maxOutput: 3.84,
      maxPosition: GAMMA_LIMIT,
      value: gamma,
    });
    const rotateY = getEasedValue({
      maxOutput: 7.9,
      maxPosition: GAMMA_LIMIT,
      value: gamma,
    });

    return {
      translateX,
      rotateY: rotateY * -1,
    };
  }

  if (mouseX !== undefined) {
    const translateX = getEasedValue({
      maxOutput: 4.17,
      maxPosition: MOUSE_X_LIMIT,
      value: mouseX,
    });
    const rotateY = getEasedValue({
      maxOutput: 3.35,
      maxPosition: MOUSE_X_LIMIT,
      value: mouseX,
    });

    return {
      translateX: translateX,
      rotateY: rotateY * -1,
    };
  }

  return {
    translateX: 0,
    rotateY: 0,
  };
};

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
