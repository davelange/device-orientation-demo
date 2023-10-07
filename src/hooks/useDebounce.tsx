import { useEffect, useRef } from "react";

export default function useDebounce() {
  const ref = useRef<ReturnType<typeof setTimeout>>(0);
  const enabled = useRef(true);

  function startInterval(interval: number) {
    enabled.current = false;

    ref.current = setTimeout(() => {
      enabled.current = true;
    }, interval);
  }

  function debounce(fn: (params?: any) => void, interval: number) {
    return (params?: any) => {
      if (!enabled.current) {
        return;
      }

      startInterval(interval);

      fn(params);
    };
  }

  useEffect(() => {
    return () => clearTimeout(ref.current);
  }, []);

  return {
    debounce,
  };
}
