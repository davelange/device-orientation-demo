import { useEffect, useRef, useState } from "react";

export default function Frame() {
  const [debug, setDebug] = useState("20");

  const ref = useRef<ReturnType<typeof setTimeout>>(0);
  const enabled = useRef(true);
  const orientation = useRef({ z: 0, x: 0 });

  function debounce() {
    enabled.current = false;

    ref.current = setTimeout(() => {
      enabled.current = true;
    }, 500);
  }

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientationEvent);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientationEvent);
      clearTimeout(ref.current);
    };
  }, []);

  const [skew, setSkew] = useState();

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

    const zDiff = orientation.current.z - event.gamma;

    orientation.current.z = event.gamma;

    setDebug(`zDiff: ${zDiff.toPrecision(2)} `);
  }

  return (
    <div className="frame">
      <img
        className="frame__image"
        src="/bg_1.webp"
        alt="A very impressive bridge"
      />
      <img
        className="frame__logo"
        src="/logo-offblack.svg"
        alt="A very impressive logo"
      />
      <p style={{ position: "absolute" }}>{debug}</p>
    </div>
  );
}
