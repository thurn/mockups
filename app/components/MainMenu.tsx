"use client";

import { useRouter } from "next/navigation";
import { ActionButton } from "./ActionButton";
import { ScreenHeader } from "./ScreenHeader";

const menuItems = ["Play", "Settings", "About", "Quit"];

export function MainMenu() {
  const router = useRouter();

  return (
    <section
      aria-label="Chess Chess Revolution main menu"
      style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden" }}
    >
      <ScreenHeader variant="game" />
      <nav
        aria-label="Main navigation"
        style={{
          position: "absolute",
          zIndex: 4,
          top: 474,
          left: 162,
          width: 700,
          display: "grid",
          gap: 24,
        }}
      >
        {menuItems.map((item) => (
          <div key={item} style={{ height: 120 }}>
            <ActionButton
              key={item}
              onClick={item === "Settings" ? () => router.push("/settings") : undefined}
            >
              {item.toUpperCase()}
            </ActionButton>
          </div>
        ))}
      </nav>
    </section>
  );
}
