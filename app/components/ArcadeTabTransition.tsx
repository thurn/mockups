"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function ArcadeTabTransition({
  activeKey,
  direction,
  reduceMotion,
  children,
}: {
  activeKey: string;
  direction: number;
  reduceMotion: boolean;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion || prefersReducedMotion;

  if (shouldReduceMotion) {
    return (
      <div key={activeKey} style={{ position: "relative", height: "100%" }}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence initial={false} custom={direction} mode="popLayout">
      <motion.div
        key={activeKey}
        custom={direction}
        initial="enter"
        animate="center"
        exit="exit"
        variants={{
          enter: (travelDirection: number) => ({
            opacity: 0,
            x: travelDirection * 58,
            scale: 0.99,
          }),
          center: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
              duration: 0.36,
              ease: [0.16, 1, 0.3, 1],
            },
          },
          exit: (travelDirection: number) => ({
            opacity: 0,
            x: travelDirection * -34,
            scale: 1.01,
            transition: { duration: 0.15, ease: [0.7, 0, 1, 0.5] },
          }),
        }}
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: direction > 0 ? "right center" : "left center",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {children}

        <motion.div
          aria-hidden="true"
          initial={{
            x: direction > 0 ? -90 : 940,
            opacity: 0,
            skewX: direction > 0 ? -12 : 12,
          }}
          animate={{
            x: direction > 0 ? 940 : -90,
            opacity: [0, 0.68, 0.68, 0],
          }}
          transition={{
            duration: 0.34,
            ease: [0.4, 0, 0.2, 1],
            times: [0, 0.22, 0.72, 1],
          }}
          style={{
            position: "absolute",
            zIndex: 8,
            top: "-8%",
            bottom: "-8%",
            left: 0,
            width: "7%",
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, transparent 0 28%, rgba(35,213,255,.16) 28% 42%, rgba(211,250,255,.92) 42% 47%, rgba(255,68,210,.62) 47% 53%, rgba(72,136,255,.13) 53% 69%, transparent 69%)",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />

        <motion.div
          aria-hidden="true"
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 1000, opacity: [0, 0.38, 0.22, 0] }}
          transition={{ duration: 0.42, ease: "linear", times: [0, 0.1, 0.72, 1] }}
          style={{
            position: "absolute",
            zIndex: 9,
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, transparent, rgba(99,243,255,.9) 14% 68%, rgba(255,82,212,.86) 88%, transparent)",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
