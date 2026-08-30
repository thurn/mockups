"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { arcadeExitDuration, arcadeMenuExitEvent, type ArcadeMenuExitDetail } from "./arcadeExit";
import { ArcadeFramePulse } from "./ArcadeFramePulse";
import { ConceptFrame } from "./ConceptFrame";
import { PORTRAIT_DESIGN_HEIGHT, PORTRAIT_DESIGN_WIDTH } from "./PortraitViewport";
import { frameClip, frameInteriorBounds } from "./styles";

export function ScreenFrame({ children }: { children: ReactNode }) {
  const [exitFrame, setExitFrame] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const handleExit = (event: Event) => {
      const detail = (event as CustomEvent<ArcadeMenuExitDetail>).detail;
      setReduceMotion(Boolean(detail?.reduceMotion));
      setExitFrame(true);
    };

    window.addEventListener(arcadeMenuExitEvent, handleExit);
    return () => window.removeEventListener(arcadeMenuExitEvent, handleExit);
  }, []);

  return (
    <div
      data-testid="screen-frame"
      style={{
        position: "relative",
        width: PORTRAIT_DESIGN_WIDTH,
        height: PORTRAIT_DESIGN_HEIGHT,
        overflow: "hidden",
        color: "#f7f8ff",
        background: "#000",
      }}
    >
      <motion.div
        aria-hidden="true"
        data-testid="exit-frame-surface"
        animate={
          exitFrame
            ? reduceMotion
              ? { opacity: 0 }
              : {
                  filter: [
                    "brightness(1) saturate(1)",
                    "brightness(2.55) saturate(1.7)",
                    "brightness(1.15) saturate(1.3)",
                    "brightness(3.8) saturate(.25)",
                    "brightness(0) saturate(0)",
                  ],
                  opacity: [1, 1, 1, 0.94, 0],
                  scaleX: [1, 1.01, 0.992, 1.018, 0.015],
                  scaleY: [1, 0.996, 1.006, 0.045, 0.002],
                  x: [0, 4, -4, 0, 0],
                }
            : { opacity: 1 }
        }
        transition={{
          duration: reduceMotion ? 0.08 : arcadeExitDuration,
          times: reduceMotion ? undefined : [0, 0.14, 0.38, 0.73, 1],
          ease: [0.65, 0, 0.35, 1],
        }}
        style={{
          position: "absolute",
          zIndex: 0,
          inset: 0,
          pointerEvents: "none",
          transformOrigin: "50% 47.07%",
          willChange: "filter, opacity, transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            ...frameInteriorBounds,
            clipPath: frameClip,
            background:
              "radial-gradient(circle at 50% 43%, #06152c 0, #020817 42%, #01030b 70%, #000107 100%)",
          }}
        />
        <ConceptFrame />
        <ArcadeFramePulse />
      </motion.div>
      {children}
    </div>
  );
}
