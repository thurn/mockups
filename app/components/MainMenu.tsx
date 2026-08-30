"use client";

import { ActionButton } from "./ActionButton";
import { ArcadeAttractMode } from "./ArcadeAttractMode";
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
  const { navigate } = useArcadeNavigation();

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
            <ActionButton onClick={item === "Settings" ? () => navigate("/settings") : undefined}>
              {item.toUpperCase()}
            </ActionButton>
          </div>
        ))}
      </nav>
      <p
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
        }}
      >
        <span>Playing with sound</span>
        <span>is recommended!</span>
      </p>
    </section>
  );
}
