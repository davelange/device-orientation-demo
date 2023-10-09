import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { DEBOUNCE_INTERVAL, LIMIT, transformsFromOrientation } from "../utils";

/* 
About device orientation:

Assuming device flat on a table
gamma: Z axis (left / right)
beta: X axis (front / back)
*/

export default function Frame() {
  const [orientation, setOrientation] = useState({ gamma: 0, beta: 0 });

  const { debounce } = useDebounce();

  const debouncedEvent = debounce(handleOrientationEvent, DEBOUNCE_INTERVAL);

  useEffect(() => {
    window.addEventListener("deviceorientation", debouncedEvent);

    return () => {
      window.removeEventListener("deviceorientation", debouncedEvent);
    };
  }, []);

  function handleOrientationEvent(event: DeviceOrientationEvent) {
    const { gamma, beta } = event;

    if (gamma === null || beta === null) {
      return;
    }

    const offLimit = gamma < LIMIT.gamma.low || gamma > LIMIT.gamma.high;

    if (offLimit) {
      return;
    }

    setOrientation({
      beta,
      gamma,
    });
  }

  const { bgRotate, bgTranslate } = transformsFromOrientation(
    orientation.gamma
  );

  return (
    <div className="frame">
      <div
        style={{
          transform: `translateX(${bgTranslate}%) perspective(200px) rotateY(${bgRotate}deg)`,
        }}
        className="frame__bg-wrapper"
      >
        <img
          className="frame__image"
          src="/bg_1.webp"
          alt="A very impressive bridge"
        />
        <div className="frame__vignette" />
      </div>
      <img className="frame__logo" src="/logo-offblack.svg" alt="Iron wallet" />
    </div>
  );
}
