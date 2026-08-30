"use client";

import { useArcadeNavigation } from "./ArcadeRouteTransition";

export const keyboardFocusGradient =
  "linear-gradient(110deg, #fffbd0 0%, #fff700 20%, #ffbd00 72%, #fff56a 100%)";

export const keyboardFocusFilter =
  "brightness(1.08) drop-shadow(0 0 3px #fff) drop-shadow(0 0 13px rgba(255,224,0,.94))";

export function ControlInteraction({
  active,
  clipPath,
  inset = 0,
}: {
  active: boolean;
  clipPath: string;
  inset?: number;
}) {
  const { reduceMotion } = useArcadeNavigation();

  if (!active) return null;

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 4,
        top: inset,
        bottom: inset,
        left: inset,
        width: "32%",
        clipPath,
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,.82) 48%, rgba(174,245,255,.46) 62%, transparent)",
        filter: "blur(.3px)",
        mixBlendMode: "screen",
        opacity: 0,
        transform: "translateX(-130%)",
        animation: reduceMotion ? "none" : "control-shine-sweep 720ms ease-out both",
        pointerEvents: "none",
      }}
    />
  );
}
