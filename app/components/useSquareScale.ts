"use client";

import { useEffect, useState } from "react";

export const DESIGN_SIZE = 900;
const VIEWPORT_GUTTER = 28;

function getScale() {
  if (typeof window === "undefined") return 1;
  return Math.min(
    1,
    (Math.min(window.innerWidth, window.innerHeight) - VIEWPORT_GUTTER) / DESIGN_SIZE,
  );
}

export function useSquareScale() {
  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const update = () => setScale(getScale());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return Math.max(0, scale);
}
