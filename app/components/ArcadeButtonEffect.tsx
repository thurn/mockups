"use client";

import { motion, useReducedMotion } from "framer-motion";

const particles = [
  { left: "10%", top: "20%", x: -34, y: -18, rotate: -22, width: 16 },
  { left: "28%", top: "5%", x: -12, y: -28, rotate: 72, width: 12 },
  { left: "52%", top: "3%", x: 5, y: -31, rotate: 94, width: 18 },
  { left: "78%", top: "8%", x: 19, y: -27, rotate: 112, width: 13 },
  { left: "93%", top: "30%", x: 34, y: -12, rotate: 18, width: 17 },
  { left: "95%", top: "72%", x: 36, y: 15, rotate: -20, width: 12 },
  { left: "72%", top: "95%", x: 16, y: 28, rotate: 68, width: 16 },
  { left: "45%", top: "97%", x: -4, y: 31, rotate: 92, width: 13 },
  { left: "17%", top: "91%", x: -24, y: 24, rotate: 118, width: 17 },
  { left: "3%", top: "61%", x: -36, y: 10, rotate: 14, width: 12 },
];

export function ArcadeButtonEffect({
  burstId,
  compact = false,
}: {
  burstId: number;
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  if (burstId === 0) return null;

  const duration = reduceMotion ? 0.01 : compact ? 0.48 : 0.62;

  return (
    <motion.span
      key={burstId}
      aria-hidden="true"
      data-button-burst={burstId}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <motion.span
        initial={{ opacity: 0.92, scale: 0.94 }}
        animate={{ opacity: [0.92, 0.7, 0], scale: [0.94, 1.02, 1.12] }}
        transition={{ duration, ease: [0.16, 0.78, 0.3, 1] }}
        style={{
          position: "absolute",
          inset: compact ? -3 : -5,
          border: `${compact ? 2 : 3}px solid #6bf6ff`,
          borderRadius: compact ? 9 : 13,
          boxShadow: "0 0 15px #2497ff, 0 0 24px rgba(255,70,211,.55)",
          clipPath:
            "polygon(0 0, 17% 0, 20% 5%, 78% 5%, 81% 0, 100% 0, 100% 35%, 97% 41%, 97% 64%, 100% 70%, 100% 100%, 82% 100%, 79% 95%, 21% 95%, 18% 100%, 0 100%, 0 70%, 3% 64%, 3% 40%, 0 34%)",
        }}
      />

      <motion.span
        initial={{ opacity: 0.9, scaleX: 0.12 }}
        animate={{ opacity: [0.9, 0.75, 0], scaleX: [0.12, 1.08, 0.45] }}
        transition={{ duration: duration * 0.7, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: "7%",
          right: "7%",
          top: -2,
          height: compact ? 3 : 4,
          background:
            "linear-gradient(90deg, transparent, #66f7ff 22%, #fff 48%, #ff5bd8 76%, transparent)",
          boxShadow: "0 0 9px #43b8ff",
          transformOrigin: "center",
        }}
      />

      {particles.map((particle, index) => (
        <motion.i
          key={index}
          initial={{
            opacity: 0.95,
            x: particle.x * 0.15,
            y: particle.y * 0.15,
            rotate: particle.rotate,
            scaleX: 0.3,
          }}
          animate={{
            opacity: [0.95, 0.9, 0],
            x: particle.x * (compact ? 0.7 : 1),
            y: particle.y * (compact ? 0.7 : 1),
            rotate: particle.rotate,
            scaleX: [0.3, 1, 0.2],
          }}
          transition={{
            duration: duration * (0.72 + index * 0.015),
            delay: reduceMotion ? 0 : index * 0.008,
            ease: [0.2, 0.82, 0.32, 1],
          }}
          style={{
            position: "absolute",
            left: particle.left,
            top: particle.top,
            width: compact ? particle.width * 0.8 : particle.width * 1.25,
            height: compact ? 3 : 4,
            borderRadius: 2,
            background: index % 2 === 0 ? "#68f7ff" : "#ff5cda",
            boxShadow:
              index % 2 === 0 ? "0 0 4px #fff, 0 0 11px #2398ff" : "0 0 4px #fff, 0 0 11px #ff37c8",
          }}
        />
      ))}
    </motion.span>
  );
}
