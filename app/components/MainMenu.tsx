"use client";

import { motion } from "framer-motion";
import { ActionButton } from "./ActionButton";
import { useArcadeNavigation } from "./ArcadeRouteTransition";
import { ScreenHeader } from "./ScreenHeader";

const menuItems = ["Play", "Settings", "About", "Quit"];
const menuButtonHeight = 140;
const menuGap = 24;
const gameWordmarkBottom = 335;
const soundRecommendationTop = 1258;
const menuHeight = menuItems.length * menuButtonHeight + (menuItems.length - 1) * menuGap;
const menuTop = gameWordmarkBottom + (soundRecommendationTop - gameWordmarkBottom - menuHeight) / 2;

export function MainMenu() {
  const { navigate, reduceMotion } = useArcadeNavigation();

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
      <motion.div
        initial={reduceMotion ? false : { opacity: 0.72, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.18,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ position: "absolute", inset: 0, willChange: "transform, opacity" }}
      >
        <ScreenHeader variant="game" />
      </motion.div>
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
        {menuItems.map((item, index) => {
          const travel = index % 2 === 0 ? -14 : 14;

          return (
            <motion.div
              key={item}
              initial={reduceMotion ? false : { opacity: 0.68, x: travel, scale: 0.99 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 0.22,
                delay: reduceMotion ? 0 : 0.025 + index * 0.025,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ height: menuButtonHeight, willChange: "transform, opacity" }}
            >
              <ActionButton onClick={item === "Settings" ? () => navigate("/settings") : undefined}>
                {item.toUpperCase()}
              </ActionButton>
            </motion.div>
          );
        })}
      </nav>
      <motion.p
        initial={reduceMotion ? false : { opacity: 0.68, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.2,
          delay: reduceMotion ? 0 : 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: "absolute",
          zIndex: 4,
          right: 80,
          bottom: 164,
          left: 80,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#fff",
          fontFamily: "'Barlow Condensed', Impact, sans-serif",
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: ".3px",
          textAlign: "center",
          textShadow: "0 3px 8px #000, 0 0 8px rgba(111,188,255,.35)",
          willChange: "transform, opacity",
        }}
      >
        <span>Playing with sound</span>
        <span>is recommended!</span>
      </motion.p>
    </section>
  );
}
