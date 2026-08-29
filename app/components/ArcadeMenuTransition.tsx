"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

const transitionDuration = 0.5;

type ArcadeMenuTransitionProps = {
  children: ReactNode;
  reduceMotion: boolean;
  screenKey: string;
};

const screenVariants = {
  initial: (direction: number) => ({
    clipPath: "inset(49.35% 8% 49.35% 8%)",
    filter: "brightness(2.2) saturate(1.8) blur(3px)",
    opacity: 0,
    scale: 0.985,
    x: direction * 18,
  }),
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",
    filter: "brightness(1) saturate(1) blur(0px)",
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    clipPath: "inset(49.35% 8% 49.35% 8%)",
    filter: "brightness(2.35) saturate(1.9) blur(3px)",
    opacity: 0,
    scale: 0.985,
    x: direction * -18,
  }),
};

export function ArcadeMenuTransition({
  children,
  reduceMotion,
  screenKey,
}: ArcadeMenuTransitionProps) {
  const direction = screenKey === "/settings" ? 1 : -1;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        <motion.div
          key={screenKey}
          custom={direction}
          variants={screenVariants}
          initial={reduceMotion ? false : "initial"}
          animate="animate"
          exit={reduceMotion ? undefined : "exit"}
          transition={{
            duration: reduceMotion ? 0 : 0.3,
            delay: reduceMotion ? 0 : 0.17,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "auto",
            transformOrigin: "center",
            willChange: "clip-path, filter, opacity, transform",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <motion.div
        key={`${screenKey}-scan`}
        aria-hidden="true"
        initial={reduceMotion ? false : { clipPath: "inset(49.7% 0 49.7% 0)", opacity: 0 }}
        animate={
          reduceMotion
            ? { clipPath: "inset(0% 0 0% 0)", opacity: 0 }
            : {
                clipPath: ["inset(49.7% 0 49.7% 0)", "inset(46% 0 46% 0)", "inset(0% 0 0% 0)"],
                opacity: [0, 0.88, 0],
              }
        }
        transition={{
          duration: reduceMotion ? 0 : transitionDuration,
          ease: [0.65, 0, 0.35, 1],
          times: [0, 0.44, 1],
        }}
        style={{
          position: "absolute",
          zIndex: 20,
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, transparent 0 7px, rgba(100,202,255,.3) 7px 9px), linear-gradient(90deg, rgba(0,121,255,.18), rgba(157,235,255,.72) 48%, rgba(231,105,255,.25))",
          boxShadow: "inset 0 0 70px rgba(96,190,255,.3)",
          mixBlendMode: "screen",
          willChange: "clip-path, opacity",
        }}
      />

      <motion.div
        key={`${screenKey}-beam`}
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, scaleX: 0.25 }}
        animate={reduceMotion ? { opacity: 0 } : { opacity: [0, 1, 0], scaleX: [0.25, 1, 0.7] }}
        transition={{ duration: reduceMotion ? 0 : transitionDuration, times: [0, 0.46, 1] }}
        style={{
          position: "absolute",
          zIndex: 21,
          top: "50%",
          right: 0,
          left: 0,
          height: 4,
          pointerEvents: "none",
          background: "#d7f8ff",
          boxShadow: "0 0 8px #fff, 0 0 22px #48bfff, 0 0 48px #ac52ff",
          transformOrigin: direction > 0 ? "left center" : "right center",
          willChange: "opacity, transform",
        }}
      />
    </div>
  );
}
