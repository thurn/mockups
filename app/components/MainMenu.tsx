"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { ActionButton } from "./ActionButton";
import { ArcadeAttractMode } from "./ArcadeAttractMode";
import { arcadeExitDuration, arcadeMenuExitEvent } from "./arcadeExit";
import { ArcadeExitSequence } from "./ArcadeExitSequence";
import { useArcadeNavigation } from "./ArcadeRouteTransition";
import { ScreenHeader } from "./ScreenHeader";
import { frameClip, frameInteriorBounds } from "./styles";
import { MusicPlaybackIndicator } from "./MusicPlaybackIndicator";

const menuItems = ["Play", "Settings", "About", "Quit"];
const menuButtonHeight = 140;
const menuGap = 24;
const menuTop = 476;

export function MainMenu() {
  const { navigate, reduceMotion } = useArcadeNavigation();
  const [exitState, setExitState] = useState<"idle" | "exiting" | "dismissed">("idle");
  const isExiting = exitState === "exiting";

  const dismissMenu = useCallback(() => {
    setExitState((current) => {
      if (current !== "idle") return current;

      window.dispatchEvent(
        new CustomEvent(arcadeMenuExitEvent, {
          detail: { reduceMotion },
        }),
      );
      return "exiting";
    });
  }, [reduceMotion]);

  useEffect(() => {
    if (!isExiting) return;

    const timeout = window.setTimeout(
      () => setExitState("dismissed"),
      (reduceMotion ? 0.08 : arcadeExitDuration) * 1000,
    );
    return () => window.clearTimeout(timeout);
  }, [isExiting, reduceMotion]);

  if (exitState === "dismissed") {
    return (
      <div
        aria-label="Main menu dismissed"
        data-testid="dismissed-main-menu"
        style={{
          position: "absolute",
          zIndex: 2,
          ...frameInteriorBounds,
          clipPath: frameClip,
          background: "#000",
        }}
      />
    );
  }

  return (
    <section
      aria-label="Chess Chess Revolution main menu"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 0,
          ...frameInteriorBounds,
          clipPath: frameClip,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          ...frameInteriorBounds,
          overflow: "hidden",
          clipPath: frameClip,
        }}
      >
        <motion.div
          animate={
            isExiting
              ? reduceMotion
                ? { opacity: 0 }
                : {
                    clipPath: [
                      "inset(0% 0% 0% 0%)",
                      "inset(0% 0% 0% 0%)",
                      "inset(0% 0% 0% 0%)",
                      "inset(46.62% 0% 52.48% 0%)",
                      "inset(47.02% 49.5% 52.88% 49.5%)",
                    ],
                    filter: [
                      "brightness(1) saturate(1)",
                      "brightness(2.3) saturate(1.65)",
                      "brightness(1.18) saturate(1.35) contrast(1.2)",
                      "brightness(3.5) saturate(.35) contrast(1.6)",
                      "brightness(0) saturate(0)",
                    ],
                    opacity: [1, 1, 1, 0.96, 0],
                    scaleX: [1, 1.008, 0.992, 1.025, 0.02],
                    scaleY: [1, 0.994, 1.008, 0.035, 0.002],
                    x: [0, -5, 4, 0, 0],
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
            top: -frameInteriorBounds.top,
            right: -frameInteriorBounds.right,
            bottom: -frameInteriorBounds.bottom,
            left: -frameInteriorBounds.left,
            overflow: "hidden",
            transformOrigin: "50% 47.07%",
            willChange: "clip-path, filter, opacity, transform",
          }}
        >
          <ArcadeAttractMode />
          <div style={{ position: "absolute", inset: 0 }}>
            <ScreenHeader variant="game" />
          </div>
          <nav
            aria-label="Main navigation"
            style={{
              position: "absolute",
              zIndex: 4,
              top: menuTop,
              left: 132,
              width: 760,
              display: "grid",
              gap: menuGap,
            }}
          >
            {menuItems.map((item) => (
              <div key={item} style={{ height: menuButtonHeight }}>
                <ActionButton
                  disabled={isExiting}
                  onClick={
                    item === "Settings"
                      ? () => navigate("/settings")
                      : item === "Play" || item === "Quit"
                        ? dismissMenu
                        : undefined
                  }
                >
                  {item.toUpperCase()}
                </ActionButton>
              </div>
            ))}
          </nav>
          <MusicPlaybackIndicator />
        </motion.div>
      </div>
      <ArcadeExitSequence active={isExiting} reduceMotion={reduceMotion} />
    </section>
  );
}
