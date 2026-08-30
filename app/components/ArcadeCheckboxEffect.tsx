"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const sparks = [
  { x: -38, y: -29, rotate: -38, width: 15 },
  { x: 0, y: -43, rotate: 90, width: 12 },
  { x: 39, y: -25, rotate: 36, width: 17 },
  { x: 44, y: 17, rotate: -24, width: 11 },
  { x: 5, y: 43, rotate: 84, width: 15 },
  { x: -42, y: 22, rotate: 28, width: 13 },
];

export function ArcadeCheckboxEffect({ checked }: { checked: boolean }) {
  const reduceMotion = useReducedMotion();
  const color = checked ? "#5ff6ff" : "#ff55c8";
  const secondary = checked ? "#5f7dff" : "#775dff";
  const duration = reduceMotion ? 0.01 : 0.78;

  return (
    <span
      aria-hidden="true"
      data-checkbox-effect={checked ? "on" : "off"}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={checked ? "power-on" : "power-off"}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.04 } }}
          style={{ position: "absolute", inset: 0 }}
        >
          <motion.span
            initial={{ opacity: 0.9, scale: 0.78 }}
            animate={{ opacity: 0, scale: 1.72 }}
            transition={{ duration, ease: [0.16, 0.8, 0.35, 1] }}
            style={{
              position: "absolute",
              inset: -5,
              border: `3px solid ${color}`,
              borderRadius: 15,
              boxShadow: `0 0 14px ${color}, inset 0 0 8px ${secondary}`,
            }}
          />

          <motion.span
            initial={{ opacity: 0.95, scale: 0.7, rotate: checked ? -18 : 18 }}
            animate={{ opacity: [0.95, 0.7, 0], scale: [0.7, 1.1, 1.42], rotate: 0 }}
            transition={{ duration: duration * 0.9, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: -11,
              borderTop: `3px solid ${color}`,
              borderRight: `3px solid ${secondary}`,
              borderBottom: "3px solid transparent",
              borderLeft: "3px solid transparent",
              borderRadius: 20,
              filter: `drop-shadow(0 0 5px ${color})`,
            }}
          />

          <motion.span
            initial={{ opacity: 0.85, scaleX: 0.08 }}
            animate={{ opacity: [0.85, 0.7, 0], scaleX: [0.08, 1.35, 0.35] }}
            transition={{ duration: duration * 0.65, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: checked ? -34 : "auto",
              right: checked ? "auto" : -34,
              top: "50%",
              width: 28,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${color} 24%, #ffffff 50%, ${color} 76%, transparent)`,
              boxShadow: `0 0 8px ${color}`,
              transformOrigin: "center",
            }}
          />

          {sparks.map((spark, index) => (
            <motion.i
              key={index}
              initial={{
                opacity: 0.95,
                x: spark.x * 0.55,
                y: spark.y * 0.55,
                rotate: spark.rotate,
                scaleX: 0.4,
              }}
              animate={{
                opacity: [0.95, 0.9, 0],
                x: spark.x,
                y: spark.y,
                rotate: spark.rotate,
                scaleX: [0.4, 1, 0.25],
              }}
              transition={{
                duration: duration * (0.7 + index * 0.025),
                delay: reduceMotion ? 0 : index * 0.012,
                ease: [0.2, 0.85, 0.35, 1],
              }}
              style={{
                position: "absolute",
                left: `calc(50% - ${spark.width / 2}px)`,
                top: "calc(50% - 1px)",
                width: spark.width,
                height: 3,
                borderRadius: 2,
                background: index % 2 === 0 ? color : secondary,
                boxShadow: `0 0 7px ${color}`,
              }}
            />
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
