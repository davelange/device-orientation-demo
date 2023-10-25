import { useEffect, useState } from "react";
import {
  throttle,
  isOffLimit,
  transformsFromOrientation,
  calcMousePosToCenter,
  GAMMA_LIMIT,
  isMobileDevice,
} from "../lib.ts";

export default function ReactFrame() {
  const [gamma, setGamma] = useState<number | undefined>();
  const [mouseX, setMouseX] = useState<number | undefined>();

  const isMobile = isMobileDevice();

  const debouncedEvent = throttle(handleOrientationEvent, 20);

  useEffect(() => {
    window.addEventListener("deviceorientation", debouncedEvent);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("deviceorientation", debouncedEvent);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  function handleOrientationEvent(event: DeviceOrientationEvent) {
    const { gamma } = event;

    if (gamma === null || isOffLimit(gamma, GAMMA_LIMIT) || isMobile) {
      return;
    }

    setGamma(gamma);
  }

  function handleMouseMove(event: MouseEvent) {
    if (isMobile) return;

    const xMotion = calcMousePosToCenter(window.innerWidth, event.clientX);

    if (xMotion === null) {
      return;
    }

    setMouseX(xMotion);
  }

  const { translateX, rotateY } = transformsFromOrientation({ gamma, mouseX });

  return (
    <div className="frame">
      <div
        style={{
          transform: `translateX(${translateX}%) perspective(200px) rotateY(${rotateY}deg)`,
        }}
        className="frame__bg-wrapper"
      >
        <img
          className="frame__image"
          src="/bg_1.webp"
          alt="A very impressive bridge"
        />
      </div>
      <img
        className="frame__logo"
        src="/logo-full-offblack.svg"
        alt="Iron wallet"
      />
    </div>
  );
}
