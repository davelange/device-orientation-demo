import { useEffect, useRef, useState } from "react";

const DEBOUNCE_INTERVAL = 10;
const DAMPING = 10;

export default function Frame() {
  const [debug, setDebug] = useState();
  const [bgImageShift, setBgImageShift] = useState(0);

  const ref = useRef<ReturnType<typeof setTimeout>>(0);
  const enabled = useRef(true);
  const orientation = useRef({ z: 0, x: 0 });

  function debounce() {
    enabled.current = false;

    ref.current = setTimeout(() => {
      enabled.current = true;
    }, DEBOUNCE_INTERVAL);
  }

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientationEvent);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientationEvent);
      clearTimeout(ref.current);
    };
  }, []);

  /* 
  When flat on a table
  Gamma - Z axis (left / right)
  Beta - X axis (front / back)
  */

  function handleOrientationEvent(event: DeviceOrientationEvent) {
    if (event?.gamma === null || event.beta === null || !enabled.current) {
      return;
    }

    debounce();

    setBgImageShift(event.gamma / DAMPING);
  }

  return (
    <div className="frame">
      <img
        className="frame__image"
        src="/bg_1.webp"
        alt="A very impressive bridge"
        style={{ translate: `${bgImageShift}% 0` }}
      />
      <img
        className="frame__logo"
        src="/logo-offblack.svg"
        alt="A very impressive logo"
      />
      <p style={{ position: "absolute" }}>{bgImageShift.toPrecision(3)}</p>
    </div>
  );
}
