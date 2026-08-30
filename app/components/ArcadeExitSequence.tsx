"use client";

import { motion } from "framer-motion";
import { frameClip, frameInteriorBounds } from "./styles";

export const arcadeExitDuration = 0.62;

export function ArcadeExitSequence({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  if (!active || reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      data-testid="arcade-exit-sequence"
      style={{
        position: "absolute",
        zIndex: 12,
        ...frameInteriorBounds,
        overflow: "hidden",
        clipPath: frameClip,
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.25, 0] }}
        transition={{ duration: 0.36, times: [0, 0.25, 0.65, 1], ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent 0 7px, rgba(181,244,255,.34) 7px 10px), linear-gradient(90deg, rgba(0,151,255,.46), rgba(255,255,255,.9) 48%, rgba(255,45,210,.48))",
          mixBlendMode: "screen",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scaleY: 0.2 }}
        animate={{ opacity: [0, 0.9, 0], scaleY: [0.2, 1, 0.08] }}
        transition={{ duration: 0.43, times: [0, 0.34, 1], ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          position: "absolute",
          inset: "9% 0",
          background:
            "linear-gradient(90deg, transparent, rgba(75,205,255,.15) 14%, rgba(232,250,255,.62) 50%, rgba(255,70,216,.16) 86%, transparent)",
          filter: "blur(18px)",
          mixBlendMode: "screen",
          transformOrigin: "center",
        }}
      />

      <motion.div
        initial={{ top: "7%", opacity: 0 }}
        animate={{ top: ["7%", "50%", "50%"], opacity: [0, 0.78, 0] }}
        transition={{ duration: 0.5, times: [0, 0.72, 1], ease: [0.7, 0, 0.3, 1] }}
        style={{
          position: "absolute",
          right: 0,
          left: 0,
          height: 4,
          background:
            "linear-gradient(90deg, transparent, #59d8ff 18%, #fff 50%, #ff5bd7 82%, transparent)",
          boxShadow: "0 0 10px #fff, 0 0 26px rgba(71,199,255,.9), 0 0 42px rgba(255,58,207,.45)",
        }}
      />

      <motion.div
        initial={{ bottom: "7%", opacity: 0 }}
        animate={{ bottom: ["7%", "50%", "50%"], opacity: [0, 0.78, 0] }}
        transition={{ duration: 0.5, times: [0, 0.72, 1], ease: [0.7, 0, 0.3, 1] }}
        style={{
          position: "absolute",
          right: 0,
          left: 0,
          height: 4,
          background:
            "linear-gradient(90deg, transparent, #ff5bd7 18%, #fff 50%, #59d8ff 82%, transparent)",
          boxShadow: "0 0 10px #fff, 0 0 26px rgba(255,58,207,.75), 0 0 42px rgba(71,199,255,.5)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scaleX: 0.08, scaleY: 0.5 }}
        animate={{
          opacity: [0, 0, 1, 0.92, 0],
          scaleX: [0.08, 0.08, 1, 0.32, 0.01],
          scaleY: [0.5, 0.5, 1.9, 0.5, 0.1],
        }}
        transition={{
          duration: arcadeExitDuration,
          times: [0, 0.52, 0.72, 0.87, 1],
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          left: 0,
          height: 5,
          marginTop: -2,
          background:
            "linear-gradient(90deg, transparent, #58d7ff 12%, #fff 43% 57%, #ff56d5 88%, transparent)",
          boxShadow:
            "0 0 7px #fff, 0 0 18px rgba(89,218,255,.95), 0 0 46px rgba(155,93,255,.9), 0 0 74px rgba(255,70,210,.46)",
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
