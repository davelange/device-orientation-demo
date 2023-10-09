import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { isOffLimit, transformsFromOrientation } from "../utils";

/* 
About device orientation:

Assuming device flat on a table
gamma: Z axis (left / right)
beta: X axis (front / back)
*/

export default function Frame() {
  const [gamma, setGamma] = useState(0);
  const { debounce } = useDebounce();

  const debouncedEvent = debounce(handleOrientationEvent, 20);

  useEffect(() => {
    window.addEventListener("deviceorientation", debouncedEvent);

    return () => {
      window.removeEventListener("deviceorientation", debouncedEvent);
    };
  }, []);

  function handleOrientationEvent(event: DeviceOrientationEvent) {
    const { gamma, beta } = event;

    if (gamma === null || beta === null || isOffLimit(gamma)) {
      return;
    }

    setGamma(gamma);
  }

  const { translateX, rotateY } = transformsFromOrientation(gamma);

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
        <div className="frame__vignette" />
      </div>
      <div className="frame__shadow" />
      <img
        className="frame__logo"
        src="/logo-full-offblack.svg"
        alt="Iron wallet"
      />
    </div>
  );
}
