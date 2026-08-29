"use client";

import { useRouter } from "next/navigation";
import { ArcadeTitle } from "./ArcadeTitle";
import { MenuButton } from "./MenuButton";

const menuItems = ["Play", "Settings", "About", "Quit"];

export function MainMenu() {
  const router = useRouter();

  return (
    <section
      aria-label="Chess Chess Revolution main menu"
      style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 102,
          width: 820,
          height: 820,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <ArcadeTitle />
        <nav
          aria-label="Main navigation"
          style={{ width: "min(100%, 700px)", display: "grid", gap: 16 }}
        >
          {menuItems.map((item) => (
            <MenuButton
              key={item}
              onClick={item === "Settings" ? () => router.push("/settings") : undefined}
            >
              {item}
            </MenuButton>
          ))}
        </nav>
      </div>
    </section>
  );
}
