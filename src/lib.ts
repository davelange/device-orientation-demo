export const GAMMA_LIMIT = 40;
export const MOUSE_POS_LIMIT = 340;
export const MOUSE_X_LIMIT = 300;

/* 
About device orientation:

Assuming device flat on a table
gamma: Z axis (left / right)
beta: X axis (front / back)
*/

export const isMobileDevice = () => {
  if (typeof window === "undefined" || !window) return false;

  return "ontouchstart" in window?.document?.documentElement;
};

export const isOffLimit = (value: number, limit: number) =>
  value < -limit || value > limit;

export function calcMousePosToCenter(window: number, pos: number) {
  const mid = window / 2;
  const diff = mid - pos;

  if (isOffLimit(diff, MOUSE_POS_LIMIT)) {
    return null;
  }

  return diff;
}

function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

function easeOutCirc(x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}
function lin(x: number): number {
  return x;
}
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
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
      maxOutput: 7,
      maxPosition: GAMMA_LIMIT,
      value: gamma,
    });
    const rotateY = getEasedValue({
      maxOutput: 7.8,
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
      maxOutput: 15,
      maxPosition: MOUSE_X_LIMIT,
      value: mouseX,
    });
    const rotateY = getEasedValue({
      maxOutput: 3.55,
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
