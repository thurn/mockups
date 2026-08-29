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
            x: travelDirection * 120,
            scale: 0.965,
            skewX: travelDirection * -2.5,
            clipPath:
              travelDirection > 0
                ? "polygon(92% 0, 100% 0, 100% 100%, 76% 100%)"
                : "polygon(0 0, 8% 0, 24% 100%, 0 100%)",
            filter: "blur(10px) brightness(2.1) saturate(1.8)",
          }),
          center: {
            opacity: 1,
            x: 0,
            scale: 1,
            skewX: 0,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            filter: "blur(0px) brightness(1) saturate(1)",
            transition: {
              duration: 0.52,
              ease: [0.16, 1, 0.3, 1],
              clipPath: { duration: 0.42, ease: [0.65, 0, 0.35, 1] },
              filter: { duration: 0.38, ease: "easeOut" },
            },
          },
          exit: (travelDirection: number) => ({
            opacity: 0,
            x: travelDirection * -72,
            scale: 1.025,
            skewX: travelDirection * 1.5,
            filter: "blur(7px) brightness(1.75) saturate(1.55)",
            transition: { duration: 0.2, ease: [0.7, 0, 1, 0.5] },
          }),
        }}
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: direction > 0 ? "right center" : "left center",
        }}
      >
        {children}

        <motion.div
          aria-hidden="true"
          initial={{ x: direction > 0 ? "-145%" : "245%", opacity: 0 }}
          animate={{ x: direction > 0 ? "430%" : "-330%", opacity: [0, 0.95, 0] }}
          transition={{ duration: 0.48, ease: [0.5, 0, 0.2, 1], times: [0, 0.38, 1] }}
          style={{
            position: "absolute",
            zIndex: 8,
            inset: "-10% auto -10% 0",
            width: "24%",
            pointerEvents: "none",
            transform: "skewX(-12deg)",
            background:
              "linear-gradient(90deg, transparent, rgba(69,233,255,.22) 22%, rgba(225,253,255,.92) 48%, rgba(255,58,211,.46) 66%, transparent)",
            boxShadow: "0 0 30px rgba(51,218,255,.58), 25px 0 45px rgba(255,48,205,.3)",
            mixBlendMode: "screen",
          }}
        />

        <motion.div
          aria-hidden="true"
          initial={{ top: "-4%", opacity: 0 }}
          animate={{ top: "104%", opacity: [0, 0.72, 0.36, 0] }}
          transition={{ duration: 0.58, ease: "linear", times: [0, 0.12, 0.72, 1] }}
          style={{
            position: "absolute",
            zIndex: 9,
            left: 0,
            right: 0,
            height: 4,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, transparent, #63f3ff 14% 68%, #ff52d4 88%, transparent)",
            boxShadow: "0 0 12px #54dfff, 0 0 26px rgba(255,55,207,.7)",
            mixBlendMode: "screen",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
