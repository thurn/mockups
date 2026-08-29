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
  const { navigate, routeTransitionPhase, transitionDestination } = useArcadeNavigation();
  const exiting = routeTransitionPhase === "exiting";
  const entering = routeTransitionPhase === "entering";
  const leavingMainMenu = exiting && transitionDestination === "/settings";

  return (
    <section
      aria-label="Chess Chess Revolution main menu"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        overflow: "hidden",
        pointerEvents: routeTransitionPhase === "idle" ? "auto" : "none",
      }}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: exiting ? 0 : 1,
          y: exiting ? -34 : 0,
          scale: exiting ? 0.99 : 1,
        }}
        transition={{
          duration: exiting ? 0.3 : 0.42,
          delay: entering ? 0.02 : 0,
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
          const selected = item === "Settings";
          const travel = index % 2 === 0 ? -118 : 118;

          return (
            <motion.div
              key={item}
              initial={false}
              animate={{
                opacity: exiting ? (selected && leavingMainMenu ? 1 : 0) : 1,
                x: exiting && !selected ? travel : 0,
                scale: selected && leavingMainMenu ? 1.045 : 1,
              }}
              transition={{
                duration: exiting ? (selected ? 0.28 : 0.34) : 0.4,
                delay: exiting ? index * 0.025 : entering ? 0.08 + index * 0.055 : 0,
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
        initial={false}
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? 34 : 0 }}
        transition={{
          duration: exiting ? 0.28 : 0.38,
          delay: entering ? 0.2 : 0,
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
