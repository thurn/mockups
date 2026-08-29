"use client";

import { useEffect, useState } from "react";

export function useViewport() {
  const [viewport, setViewport] = useState({ mobile: false, short: false });

  useEffect(() => {
    const update = () =>
      setViewport({
        mobile: window.innerWidth <= 700,
        short: window.innerHeight <= 760 && window.innerWidth > 700,
      });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return viewport;
}
