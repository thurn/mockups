"use client";

import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import type { ReactNode } from "react";
import { frameClip, frameInteriorBounds } from "./styles";
import { useAppleTouchWebKit } from "./useAppleTouchWebKit";

const transitionDuration = 0.5;

type ArcadeMenuTransitionProps = {
  children: ReactNode;
  playTransition: boolean;
  reduceMotion: boolean;
  screenKey: string;
};

const screenVariants = {
  initial: {
    clipPath: "inset(49.35% 8% 49.35% 8%)",
    filter: "brightness(2.2) saturate(1.8) blur(3px)",
    opacity: 0,
  },
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",
    filter: "brightness(1) saturate(1) blur(0px)",
    opacity: 1,
  },
  exit: {
    clipPath: "inset(49.35% 8% 49.35% 8%)",
    filter: "brightness(2.35) saturate(1.9) blur(3px)",
    opacity: 0,
  },
};

const webKitSafeScreenVariants = {
  initial: { opacity: 0, scale: 0.985 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.012 },
};

export function ArcadeMenuTransition({
  children,
  playTransition,
  reduceMotion,
  screenKey,
}: ArcadeMenuTransitionProps) {
  const direction = screenKey === "settings" ? 1 : -1;
  const useWebKitSafeTransition = useAppleTouchWebKit();

  return (
    <div
      data-webkit-safe-transition={useWebKitSafeTransition || undefined}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <AnimatePresence initial={false} mode={useWebKitSafeTransition ? "wait" : "sync"}>
        <ArcadeScreen
          key={screenKey}
          reduceMotion={reduceMotion}
          useWebKitSafeTransition={useWebKitSafeTransition}
        >
          {children}
        </ArcadeScreen>
      </AnimatePresence>

      <ContainedCrtEffect
        direction={direction}
        playTransition={playTransition}
        reduceMotion={reduceMotion}
        screenKey={screenKey}
        useWebKitSafeTransition={useWebKitSafeTransition}
      />
    </div>
  );
}

function ArcadeScreen({
  children,
  reduceMotion,
  useWebKitSafeTransition,
}: {
  children: ReactNode;
  reduceMotion: boolean;
  useWebKitSafeTransition: boolean;
}) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      aria-hidden={!isPresent}
      inert={!isPresent}
      variants={useWebKitSafeTransition ? webKitSafeScreenVariants : screenVariants}
      initial={reduceMotion ? false : "initial"}
      animate="animate"
      exit={reduceMotion ? undefined : "exit"}
      transition={{
        duration: reduceMotion ? 0 : useWebKitSafeTransition ? 0.16 : 0.3,
        delay: reduceMotion || useWebKitSafeTransition ? 0 : 0.17,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: isPresent ? "auto" : "none",
        willChange: useWebKitSafeTransition ? "transform, opacity" : "clip-path, filter, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}

function ContainedCrtEffect({
  direction,
  playTransition,
  reduceMotion,
  screenKey,
  useWebKitSafeTransition,
}: {
  direction: number;
  playTransition: boolean;
  reduceMotion: boolean;
  screenKey: string;
  useWebKitSafeTransition: boolean;
}) {
  if (useWebKitSafeTransition) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 20,
          ...frameInteriorBounds,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <motion.div
          key={`${screenKey}-webkit-beam`}
          initial={reduceMotion || !playTransition ? false : { opacity: 0, scaleX: 0.15 }}
          animate={
            reduceMotion || !playTransition
              ? { opacity: 0 }
              : { opacity: [0, 0.72, 0], scaleX: [0.15, 1, 0.72] }
          }
          transition={{ duration: reduceMotion ? 0 : 0.3, times: [0, 0.48, 1] }}
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            left: 0,
            height: 3,
            background: "#d7f8ff",
            boxShadow:
              "0 0 6px rgba(255,255,255,.88), 0 0 15px rgba(72,191,255,.68), 0 0 26px rgba(172,82,255,.42)",
            transformOrigin: direction > 0 ? "left center" : "right center",
            willChange: "opacity, transform",
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      data-testid="contained-crt-effect"
      style={{
        position: "absolute",
        zIndex: 20,
        ...frameInteriorBounds,
        overflow: "hidden",
        clipPath: frameClip,
        pointerEvents: "none",
      }}
    >
      <motion.div
        key={`${screenKey}-scan`}
        initial={
          reduceMotion || !playTransition
            ? false
            : { clipPath: "inset(49.7% 0 49.7% 0)", opacity: 0 }
        }
        animate={
          reduceMotion || !playTransition
            ? { clipPath: "inset(0% 0 0% 0)", opacity: 0 }
            : {
                clipPath: ["inset(49.7% 0 49.7% 0)", "inset(46% 0 46% 0)", "inset(0% 0 0% 0)"],
                opacity: [0, 0.48, 0],
              }
        }
        transition={{
          duration: reduceMotion ? 0 : transitionDuration,
          ease: [0.65, 0, 0.35, 1],
          times: [0, 0.44, 1],
        }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent 0 7px, rgba(100,202,255,.18) 7px 9px), linear-gradient(90deg, rgba(0,121,255,.1), rgba(157,235,255,.42) 48%, rgba(231,105,255,.14))",
          boxShadow: "inset 0 0 54px rgba(96,190,255,.16)",
          mixBlendMode: "screen",
          willChange: "clip-path, opacity",
        }}
      />

      <motion.div
        key={`${screenKey}-beam`}
        initial={reduceMotion || !playTransition ? false : { opacity: 0, scaleX: 0.25 }}
        animate={
          reduceMotion || !playTransition
            ? { opacity: 0 }
            : { opacity: [0, 0.68, 0], scaleX: [0.25, 1, 0.7] }
        }
        transition={{ duration: reduceMotion ? 0 : transitionDuration, times: [0, 0.46, 1] }}
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          left: 0,
          height: 3,
          background: "#d7f8ff",
          boxShadow:
            "0 0 6px rgba(255,255,255,.9), 0 0 16px rgba(72,191,255,.75), 0 0 32px rgba(172,82,255,.5)",
          transformOrigin: direction > 0 ? "left center" : "right center",
          willChange: "opacity, transform",
        }}
      />
    </div>
  );
}
