import { useEffect, useRef, useState, type CSSProperties } from "react";

const DEBOUNCE_INTERVAL = 50;
const DAMPING = 20;
const LIMIT = {
  gamma: {
    low: -40,
    high: 40,
  },
};

export default function Frame() {
  const [debug, setDebug] = useState("");
  const [bgImageShift, setBgImageShift] = useState(0);
  const [fgImageRotate, setFgImageRotate] = useState(0);

  const ref = useRef<ReturnType<typeof setTimeout>>(0);
  const enabled = useRef(true);

  /* 
  When flat on a table
  Gamma - Z axis (left / right)
  Beta - X axis (front / back)
  */
  const orientation = useRef({ gamma: 0, beta: 0 });

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

  function handleOrientationEvent(event: DeviceOrientationEvent) {
    if (event?.gamma === null || event.beta === null || !enabled.current) {
      return;
    }

    debounce();

    const diff = Math.abs(event.gamma - orientation.current.gamma);
    const offLimit =
      event.gamma < LIMIT.gamma.low || event.gamma > LIMIT.gamma.high;

    if (diff < 1 || offLimit) return;

    setBgImageShift(event.gamma / DAMPING);
    setFgImageRotate((event.gamma / 6) * -1);

    orientation.current = {
      beta: event.beta,
      gamma: event.gamma,
    };
    setDebug(`${orientation.current.gamma.toPrecision(2)}`);
  }

  return (
    <div className="frame">
      <div
        style={{
          transform: `translateX(${bgImageShift}%) perspective(200px) rotateY(${fgImageRotate}deg)`,
        }}
        className="frame__bg-wrapper"
      >
        <img
          className="frame__image"
          src="/bg_1.webp"
          alt="A very impressive bridge"
        />
        <div
          className="frame__blur"
          style={
            {
              opacity: Math.abs(bgImageShift) > 0.5 ? 1 : 0,
              "-webkit-mask-image":
                bgImageShift > 0
                  ? `linear-gradient(90deg, black 40%, transparent 60%)`
                  : `linear-gradient(90deg, transparent 40%, black 60%)`,
            } as CSSProperties
          }
        />
        <div></div>
      </div>

      <img
        className="frame__logo"
        src="/logo-offblack.svg"
        alt="A very impressive logo"
        style={{
          transform: `perspective(200px) rotateY(${
            fgImageRotate * 2
          }deg) translateX(${bgImageShift * 2}%)`,
        }}
      />
      {/* <p style={{ position: "absolute", top: 0 }}>
        {Math.abs(bgImageShift).toPrecision(3)}
      </p> */}
    </div>
  );
}
