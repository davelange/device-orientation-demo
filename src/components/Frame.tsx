import { useEffect, useRef, useState, type CSSProperties } from "react";

const DEBOUNCE_INTERVAL = 10;
const DAMPING = 10;

export default function Frame() {
  const [debug, setDebug] = useState();
  const [bgImageShift, setBgImageShift] = useState(0);
  const [fgImageRotate, setFgImageRotate] = useState(0);

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
    setFgImageRotate((event.gamma / 6) * -1);
  }

  return (
    <div className="frame">
      <div
        style={{
          height: "110%",
          transform: `translateX(${bgImageShift}%) perspective(200px) rotateY(${fgImageRotate}deg)`,
        }}
      >
        <img
          className="frame__image"
          src="/bg_1.webp"
          alt="A very impressive bridge"
        />
        <img
          className="frame__image--blurred"
          src="/bg_1.webp"
          alt="A very impressive bridge"
          style={
            {
              opacity: Math.abs(bgImageShift) > 1.9 ? 1 : 0,
              "-webkit-mask-image":
                bgImageShift > 0
                  ? `linear-gradient(90deg, black 40%, transparent 60%)`
                  : `linear-gradient(90deg, transparent 40%, black 60%)`,
            } as CSSProperties
          }
        />
      </div>
      {/* <div className="frame__blur"></div> */}
      <img
        className="frame__logo"
        src="/logo-offblack.svg"
        alt="A very impressive logo"
        style={{
          transform: `perspective(200px) rotateY(${
            fgImageRotate * 2
          }deg) translateX(${bgImageShift * 3}%)`,
        }}
      />
      {/* <p style={{ position: "absolute", top: 0 }}>
        {bgImageShift.toPrecision(3)}
      </p> */}
    </div>
  );
}
