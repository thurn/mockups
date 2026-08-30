"use client";

import { motion, useReducedMotion } from "framer-motion";

const particles = [
  { x: -35, y: -27, rotate: -34, width: 14 },
  { x: -9, y: -39, rotate: 76, width: 11 },
  { x: 25, y: -34, rotate: 43, width: 16 },
  { x: 38, y: -5, rotate: 8, width: 12 },
  { x: 31, y: 29, rotate: -39, width: 15 },
  { x: 1, y: 42, rotate: 88, width: 12 },
  { x: -31, y: 30, rotate: 37, width: 16 },
  { x: -41, y: 2, rotate: -8, width: 11 },
];

export function ArcadeSliderEffect({ burstId }: { burstId: number }) {
  const reduceMotion = useReducedMotion();

  if (burstId === 0) return null;

  const duration = reduceMotion ? 0.01 : 0.66;

  return (
    <motion.span
      key={burstId}
      aria-hidden="true"
      data-slider-burst={burstId}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 3,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <motion.span
        initial={{ opacity: 0.9, scale: 0.72, rotate: -16 }}
        animate={{ opacity: [0.9, 0.65, 0], scale: [0.72, 1.3, 1.6], rotate: 12 }}
        transition={{ duration, ease: [0.16, 0.8, 0.35, 1] }}
        style={{
          position: "absolute",
          inset: -5,
          border: "3px solid #62f6ff",
          borderRadius: 15,
          boxShadow: "0 0 13px #1f9cff, inset 0 0 8px #735dff",
        }}
      />

      {particles.map((particle, index) => (
        <motion.i
          key={index}
          initial={{
            opacity: 0.95,
            x: particle.x * 0.45,
            y: particle.y * 0.45,
            rotate: particle.rotate,
            scaleX: 0.35,
          }}
          animate={{
            opacity: [0.95, 0.85, 0],
            x: particle.x,
            y: particle.y,
            rotate: particle.rotate,
            scaleX: [0.35, 1, 0.2],
          }}
          transition={{
            duration: duration * (0.72 + index * 0.025),
            delay: reduceMotion ? 0 : index * 0.01,
            ease: [0.2, 0.85, 0.35, 1],
          }}
          style={{
            position: "absolute",
            left: `calc(50% - ${particle.width / 2}px)`,
            top: "calc(50% - 1px)",
            width: particle.width,
            height: 3,
            borderRadius: 2,
            background: index % 2 === 0 ? "#68f7ff" : "#ff5cda",
            boxShadow:
              index % 2 === 0 ? "0 0 4px #fff, 0 0 10px #2398ff" : "0 0 4px #fff, 0 0 10px #ff37c8",
          }}
        />
      ))}
    </motion.span>
  );
}
